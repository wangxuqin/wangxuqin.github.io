--[Comment]
--排行榜模块
RankingModule = {};
RankingModule.TAG                       = "RankingModule"

RankingModule.SORT_BY_MONEY             = "SORT_BY_MONEY";
RankingModule.SORT_BY_EXP               = "SORT_BY_EXP";
RankingModule.SORT_BY_LEVEL             = "SORT_BY_LEVEL";

RankingModule.m_rankingPopUp            = "";
RankingModule.m_page                    = nil;
RankingModule.m_moneyRankList           = {};
RankingModule.m_moneyRanking            = "";
RankingModule.m_moneyRankingDesc        = "";
RankingModule.m_expRankList             = {};
RankingModule.m_expRanking              = "";
RankingModule.m_expRankingDesc          = "";
RankingModule.m_achiRankList            = {};
RankingModule.m_achiRanking             = "";
RankingModule.m_achiRankingDesc         = "";
		
RankingModule.m_friendMoneyRankList     = {};
RankingModule.m_friendExpRankList       = {};
RankingModule.m_friendAchiRankList      = {};
RankingModule.m_myMoneyOfFriendRanking  = ""
RankingModule.m_myMoneyOfFriendDesc     = "";
RankingModule.m_myExpOfFriendRanking    = "";
RankingModule.m_myExpOfFriendDesc       = "";
RankingModule.m_myAchiOfFriendRanking   = "";
RankingModule.m_myAchiOfFriendDesc      = "";
		
RankingModule.m_myAchiData              = 0;
RankingModule.m_myCompAchiData          = nil;
RankingModule.m_currentTabIndex         = 0;
		
RankingModule.__eventList = {
    {CommandEvent, CommandEvent.s_cmd.USER_LOGGED_IN,               "onUserLoggedIn"};
    {CommandEvent, CommandEvent.s_cmd.OPEN_RANKING_POP_UP,          "openRankingPopUp"};
    {CommandEvent, CommandEvent.s_cmd.RANKING_PAGE_TAB_CHANGE,      "rankingTabChangeHandler"};
    {CommandEvent, CommandEvent.s_cmd.RANKING_PAGE_TOP_TAB_CHANGE,  "rankingTopTabChangeHandler"};
}
	
RankingModule.initialize = function()
	local tabGroup                       = {};
	tabGroup[1]                          = new(PageTabGroupData, nil, STR_RANKING_RANKING_TAB_ITEM);
	RankingModule.m_rankingPopUp         = new(RankingPopUp, STR_RANKING_RANKING_POPUP_TITLE,tabGroup);
	RankingModule.m_moneyRankList        = {};
	RankingModule.m_expRankList          = {};
	RankingModule.m_achiRankList         = {};
	RankingModule.m_friendMoneyRankList  = {};
	RankingModule.m_friendExpRankList    = {};
	RankingModule.m_friendAchiRankList   = {};		
    EventDispatcher.getInstance():registerEventList(RankingModule, RankingModule.__eventList);
end
		
RankingModule.cacheFriendList = function(self)
	HttpService.post({["mod"] = "friend",["act"] = "getOnlineFriends"},self, self.cacheFriendListResult);
end
		
RankingModule.defaultErrorHandler = function(self, arg1, arg2)
	Model.setData(ModelKeys.RANKING_LIST_DISPLAY, STR_COMMON_PHP_REQUEST_ERROR_MSG);
end
		
RankingModule.cacheFriendListResult = function(self, data)
	local flag, jsonObj = JsonKit.decode(data);
	if flag then
        local rankingVO = nil;
	    local list      = {};
	    local uidList   = {};
	    for _, item in pairs(jsonObj) do
		    rankingVO = new(RankingVO, item);
		    table.insert(list, rankingVO);
		    table.insert(uidList, rankingVO.uid);
	    end
	    --加入自己再排序
	    self:addSelfAndSort(list);
	    Model.setData(ModelKeys.FRIEND_UID_LIST, uidList);
	    Model.setData(ModelKeys.RANKING_LIST_INITIAL_FRIEND, list);
	    Model.setData(ModelKeys.FRIEND_LIST, jsonObj);
    else
        Log.e(self.TAG, "cacheFriendListResult", "decode json has an error occurred!");
    end
end
		
private function addSelfAndSort(list:Array,sortType:String = ""):RankingVO
{
	var rankingVO:RankingVO = new RankingVO(null);
	rankingVO.chipTotal = userData.money;
	rankingVO.img = userData.s_picture;
	rankingVO.level = userData.level;
	rankingVO.nick = userData.nick;
	rankingVO.levelName = userData.title;
	rankingVO.siteid = String(userData.siteuid);
	rankingVO.uid = String(userData.uid);
	rankingVO.winPercent = String(int(userData.win * 100 / (userData.win + userData.lose)));
	rankingVO.ach = myAchiData;
	if(sortType == "" || sortType == SORT_BY_MONEY)
	{
		rankingVO.chipTotal = userData.money;
	}
	else if(sortType == SORT_BY_EXP)
	{
		rankingVO.chipTotal = userData.level;
	}
	else if(sortType == SORT_BY_LEVEL)
	{
		rankingVO.chipTotal = myAchiData;
	}
			
	//把自己加进去
	list.push(rankingVO);
			
	//进行一下排序
	list.sort(function(obj1:RankingVO, obj2:RankingVO):Number {
		var sub:Number 
		if(sortType == "" || sortType == SORT_BY_MONEY)
		{
			sub = obj1.chipTotal - obj2.chipTotal;
		}
		else if(sortType == SORT_BY_EXP)
		{
			sub = obj1.level - obj2.level;
		}
		else if(sortType == SORT_BY_LEVEL)
		{
			sub = obj1.ach - obj2.ach;
		}
		if(sub == 0)
		{
			//当遇到与自己筹码数目相等的，把自己放到前面
			if(obj1.uid == rankingVO.uid)
			{
				return -1;
			} else if(obj2.uid == rankingVO.uid) {
				return 1;
			} else {
				return 0;
			}
		} else if(sub > 0) {
			return -1;
		} else {
			return 1;
		}
	});
			
	//找到自己的位置
	var retData:RankingVO;
	for(var i:int = 0, found:Boolean = false; i < list.length; i++)
	{
		list[i].friendRanking = i + 1;
		if(!found && list[i] == rankingVO)
		{
			found = true;
			if(sortType == "" || sortType == SORT_BY_MONEY)
			{
				myMoneyOfFriendRanking = String(i + 1);
			}
			else if(sortType == SORT_BY_EXP)
			{
				myExpOfFriendRanking = String(i + 1);
			}
			else if(sortType == SORT_BY_LEVEL)
			{
				myAchiOfFriendRanking = String(i + 1);
			}
			if(i + 1 > 30) {
				//三十名开外，跟30名比较
				retData = list[29];
			} else if(i == 0){
				//第一名返回自己
				retData = rankingVO;
			} else {
				//否则返回前一名
				retData = list[i - 1];
			}
		}
	}
			
	//干掉多余三十个的，保持队形
	while(list.length > 30) {
		list.pop();
	}
			
	return retData;
}
		
private function onUserLoggedIn(evt:Event):void
{
	model.clearData(ModelKeys.RANKING_LIST_DISPLAY);
	model.setData(ModelKeys.RANKING_LIST_DISPLAY,null);
	model.clearData(ModelKeys.RANKING_LIST_INITIAL_FRIEND);
	model.clearData(ModelKeys.FRIEND_LIST);
	refreshAllRankingData();
	cacheFriendList();
}
		
private function refreshFriendRankingData():void
{
//			model.clearData(ModelKeys.RANKING_LIST_DISPLAY);
	model.setData(ModelKeys.RANKING_LIST_DISPLAY,null);
	httpService.POST({"mod":"friend","act":"list"}, refreshFriendListResult, defaultErrorHandler);
}
		
private function refreshFriendListResult(data:String):void
{
	var json:Object = JSON.parse(data as String);
	var rankingVO:RankingVO;
	friendMoneyRankList = [];
	friendExpRankList = [];
	friendAchiRankList = [];
	for each(var obj:Object in json) {
		rankingVO = new RankingVO(obj);
		friendMoneyRankList.push(rankingVO);
	}
	for each(obj in json) {
		rankingVO = new RankingVO(obj,1);
		friendExpRankList.push(rankingVO);
	}
	for each(obj in json) {
		rankingVO = new RankingVO(obj,2);
		friendAchiRankList.push(rankingVO);
	}
			
	if(!model.hasData(ModelKeys.RANKING_LIST_INITIAL_FRIEND))
	{
		model.setData(ModelKeys.RANKING_LIST_INITIAL_FRIEND, friendMoneyRankList.slice(0, friendMoneyRankList.length));
	}
	//加入自己再排序（资产排序）
	rankingVO = addSelfAndSort(friendMoneyRankList,SORT_BY_MONEY);
	//比较得出升降
	compareWithInitialFriend(friendMoneyRankList);
	myMoneyOfFriendDesc = this.formateEnc(Formatter.formatNumberWithSplit(rankingVO.chipTotal - userData.money), rankingVO.friendRanking, (rankingVO.uid == String(userData.uid)) ? 1 : rankingVO.friendRanking + 1, 0, 1);
			
	//加入自己再排序（等级排序）
	rankingVO = addSelfAndSort(friendExpRankList,SORT_BY_EXP);
	//比较得出升降
	compareWithInitialFriend(friendExpRankList);
	myExpOfFriendDesc = this.formateEnc(Formatter.formatNumberWithSplit(rankingVO.level - userData.level), rankingVO.friendRanking, (rankingVO.uid == String(userData.uid)) ? 1 : rankingVO.friendRanking + 1, 1, 1);
			
	//加入自己再排序（成就排序）
	rankingVO = addSelfAndSort(friendAchiRankList,SORT_BY_LEVEL);
	//比较得出升降
	compareWithInitialFriend(friendAchiRankList);
	myCompAchiData = rankingVO;
	myAchiOfFriendDesc = this.formateEnc(Formatter.formatNumberWithSplit(rankingVO.ach - myAchiData), rankingVO.friendRanking, (rankingVO.uid == String(userData.uid)) ? 1 : rankingVO.friendRanking + 1, 2, 1);
}
		
private function compareWithInitialFriend(list:Array):void
{
	var initArr:Array = model.getData(ModelKeys.RANKING_LIST_INITIAL_FRIEND);
			
	if(initArr && list)
	{
		var src:RankingVO, desc:RankingVO;
		for(var i:int = 0, j:int, found:Boolean; i < list.length; i++)
		{
			src = list[i];
			for(j = 0, found = false; j < initArr.length; j++)
			{
				desc = initArr[j];
				if(src.uid == desc.uid)
				{
					found = true;
					src.upOrDown = i < j ? "up" : i > j ? "down" : "";
					break;
				}
			}
			//找不到证明之前没上榜，这次为上升
			if(!found) {
				src.upOrDown = "up";
			}
		}
	}
}
		
/**
	* mainTab 0:筹码，1：经验， 2：等级
	* 新版全服排行榜的鼓励文字
	*/
public function formateEnc(value:String, comRank:int, myRank:int, mainTab:int, viceTab:int):String
{
	var comRankText:String = comRank.toString();
	var text:String;
	if(myRank == 1) 
	{
		if(mainTab == 0) 
		{
			if(viceTab == 0)
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[0].getText();
			}
			else 
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[1].getText();
			}
		}
		else if(mainTab == 1) 
		{
			if(viceTab == 0)
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[2].getText();
			}
			else 
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[3].getText();
			}
		}
		else 
		{
			if(viceTab == 0) 
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[4].getText();
			}
			else 
			{
				text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[5].getText();
			}
		}
		return text;
	}
	else if(comRank == 1)
	{
		if(mainTab == 0) 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[6].getText(value, comRankText);
		}
		else if(mainTab == 1) 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[7].getText(value, comRankText);
		}
		else 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[8].getText(value, comRankText);
		}
		return text;
	}
	else
	{
		if(mainTab == 0) 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[9].getText(value, comRankText);
		}
		else if(mainTab == 1) 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[10].getText(value, comRankText);
		}
		else if(mainTab == 2) 
		{
			text = Localization.getArray("RANKING.RANKING_FORMAT_RESOURCE")[11].getText(value, comRankText);
		}
		else 
		{
			return "";
		}
		return text;
	}
}
		
//open ranking popup
private function openRankingPopUp(evt:Event):void
{
	refreshAllRankingData();
	refreshFriendRankingData();
	if (evt.data)
	{
		rankingPopUp.currentTab = evt.data as int;
	}
	rankingPopUp.show();
}
		
private var topTabIndex:int = 0;
private function rankingTabChangeHandler(evt:Event = null):void
{
	if(evt)
	{
		var data:Object = evt.data as Object;
		currentTabIndex = data.leftToggle;
		topTabIndex = data.topToggle;
	}
	switch(currentTabIndex)
	{
		case 0 : //资产排名
			if(topTabIndex == 0)
			{
				userData["my_ranking_display"] = moneyRanking;
				userData["my_ranking_desc_display"] = moneyRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, moneyRankList);
			}
			else if(topTabIndex == 1)
			{
				userData["my_ranking_display"] = myMoneyOfFriendRanking;
				userData["my_ranking_desc_display"] = myMoneyOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendMoneyRankList);
			}
			break;
		case 1 : //等级排名
			if(topTabIndex == 0)
			{
				userData["my_ranking_display"] = expRanking;
				userData["my_ranking_desc_display"] = expRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, expRankList);
			}
			else if(topTabIndex == 1)
			{
				userData["my_ranking_display"] = myExpOfFriendRanking;
				userData["my_ranking_desc_display"] = myExpOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendExpRankList);
			}
			break;
		case 2 : //成就排名
			if(topTabIndex == 0)
			{
				userData["my_ranking_display"] = achiRanking;
				userData["my_ranking_desc_display"] = achiRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, achiRankList);
			}
			else if(topTabIndex == 1)
			{
				userData["my_ranking_display"] = myAchiOfFriendRanking;
				userData["my_ranking_desc_display"] = myAchiOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendAchiRankList);
			}
			break;
	}	
}
		
private function rankingTopTabChangeHandler(evt:Event = null):void
{
	if(evt)
	{
		topTabIndex = evt.data as int;
	}
	switch(topTabIndex)
	{
		case 0 :
			AnalysisUtil.onEvent(AnalysisEventIds.SEC_MENU_RANKING_ALL);
			if(currentTabIndex == 0)
			{
				userData["my_ranking_display"] = moneyRanking;
				userData["my_ranking_desc_display"] = moneyRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, moneyRankList);
			}
			else if(currentTabIndex == 1)
			{
				userData["my_ranking_display"] = expRanking;
				userData["my_ranking_desc_display"] = expRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, expRankList);
			}
			else if(currentTabIndex == 2)
			{
				userData["my_ranking_display"] = achiRanking;
				userData["my_ranking_desc_display"] = achiRankingDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, achiRankList);
			}
			break;
		case 1 :
			AnalysisUtil.onEvent(AnalysisEventIds.SEC_MENU_RANKING_FRIEND);
			if(currentTabIndex == 0)
			{
				userData["my_ranking_display"] = myMoneyOfFriendRanking;
				userData["my_ranking_desc_display"] = myMoneyOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendMoneyRankList);
			}
			else if(currentTabIndex == 1)
			{
				userData["my_ranking_display"] = myExpOfFriendRanking;
				userData["my_ranking_desc_display"] = myExpOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendExpRankList);
			}
			else if(currentTabIndex == 2)
			{
				userData["my_ranking_display"] = myAchiOfFriendRanking;
				userData["my_ranking_desc_display"] = myAchiOfFriendDesc;
				model.setData(ModelKeys.RANKING_LIST_DISPLAY, friendAchiRankList);
			}
			break;
	}
}
		
private function refreshAllRankingData():void
{
	model.setData(ModelKeys.RANKING_LIST_DISPLAY,null);
	userData["my_ranking_display"] = "";
	userData["my_ranking_desc_display"] = "";
	httpService.POST({"mod":"rank", "act":"main"}, onRefreshRankingDataResult, defaultErrorHandler);
}
		
private function onRefreshRankingDataResult(data:String):void
{
	var json:Object = JSON.parse(data) as Object;
	if(json)
	{
		var rankingVO:RankingVO;
		if(json.hasOwnProperty("money"))
		{
			moneyRankList = [];
			for each(var obj:Object in json.money.list) {
				rankingVO = new RankingVO(obj);
				moneyRankList.push(rankingVO);
			}
			if(moneyRankList && moneyRankList.length > 0)
			{
				moneyRanking = (json.money.rank && Number(json.money.rank) <= 10000 ? json.money.rank : ">10000");
				moneyRankingDesc = this.formateEnc(Formatter.formatNumberWithSplit(json.money.c_d - json.money.data), json.money.c_r, json.money.rank, 0, 0);
			}
		}
				
		if(json.hasOwnProperty("exp"))
		{
			expRankList = [];
			for each(obj in json.exp.list) {
				rankingVO = new RankingVO(obj);
				expRankList.push(rankingVO);
			}
			if(expRankList && expRankList.length > 0)
			{
				expRanking = (json.exp.rank && Number(json.exp.rank) <= 10000 ? json.exp.rank : ">10000");
				expRankingDesc = this.formateEnc(Formatter.formatNumberWithSplit(json.exp.c_d - json.exp.data), json.exp.c_r, json.exp.rank, 1, 0);
			}
		}
				
		if(json.hasOwnProperty("achi"))
		{
			achiRankList = [];
			for each(obj in json.achi.list) {
				rankingVO = new RankingVO(obj);
				achiRankList.push(rankingVO);
			}
			if(achiRankList && achiRankList.length > 0)
			{
				achiRanking = (json.achi.rank && Number(json.achi.rank) <= 10000 ? json.achi.rank : ">10000");
				achiRankingDesc = this.formateEnc(Formatter.formatNumberWithSplit(json.achi.c_d - json.achi.data), json.achi.c_r, json.achi.rank, 2, 0);
				myAchiData = json.achi.data;
				if(myCompAchiData)
				{
					myAchiOfFriendDesc = this.formateEnc(Formatter.formatNumberWithSplit(myCompAchiData.ach - myAchiData), myCompAchiData.friendRanking, (myCompAchiData.uid == String(userData.uid)) ? 1 : myCompAchiData.friendRanking + 1, 2, 1);
				}
			}
		}
				
		rankingTabChangeHandler();
		rankingTopTabChangeHandler();
	}
}
}
}