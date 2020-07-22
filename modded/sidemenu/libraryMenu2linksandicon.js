"use strict";function _createForOfIteratorHelper(o,allowArrayLike){var it;if("undefined"==typeof Symbol||null==o[Symbol.iterator]){if(Array.isArray(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&"number"==typeof o.length){it&&(o=it);var i=0,F=function(){};return{s:F,n:function(){return i>=o.length?{done:!0}:{done:!1,value:o[i++]}},e:function(_e){throw _e},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var err,normalCompletion=!0,didErr=!1;return{s:function(){it=o[Symbol.iterator]()},n:function(){var step=it.next();return normalCompletion=step.done,step},e:function(_e2){didErr=!0,err=_e2},f:function(){try{normalCompletion||null==it.return||it.return()}finally{if(didErr)throw err}}}}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}define(["dom","layoutManager","inputManager","connectionManager","events","viewManager","libraryBrowser","appRouter","apphost","playbackManager","syncPlayManager","groupSelectionMenu","browser","globalize","scripts/imagehelper","paper-icon-button-light","material-icons","scrollStyles","flexStyles"],function(dom,layoutManager,inputManager,connectionManager,events,viewManager,libraryBrowser,appRouter,appHost,playbackManager,syncPlayManager,groupSelectionMenu,browser,globalize,imageHelper){function getCurrentApiClient(){return currentUser&&currentUser.localUser?connectionManager.getApiClient(currentUser.localUser.ServerId):connectionManager.currentApiClient()}function onBackClick(){appRouter.back()}function updateUserInHeader(user){var hasImage,policy;user&&user.name?(user.imageUrl&&(updateHeaderUserButton(user.imageUrl),hasImage=!0),headerUserButton.title=user.name,headerUserButton.classList.remove("hide")):headerUserButton.classList.add("hide"),hasImage||updateHeaderUserButton(null),user&&user.localUser?(headerHomeButton&&headerHomeButton.classList.remove("hide"),headerSearchButton&&headerSearchButton.classList.remove("hide"),layoutManager.tv||headerCastButton.classList.remove("hide"),policy=user.Policy?user.Policy:user.localUser.Policy,headerSyncButton&&policy&&"None"!==policy.SyncPlayAccess&&headerSyncButton.classList.remove("hide")):(headerHomeButton.classList.add("hide"),headerCastButton.classList.add("hide"),headerSyncButton.classList.add("hide"),headerSearchButton&&headerSearchButton.classList.add("hide")),requiresUserRefresh=!1}function updateHeaderUserButton(src){src?(headerUserButton.classList.add("headerUserButtonRound"),headerUserButton.innerHTML='<div class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound" style="background-image:url(\''+src+"');\"></div>"):(headerUserButton.classList.remove("headerUserButtonRound"),headerUserButton.innerHTML='<span class="material-icons person"></span>')}function showSearch(){inputManager.trigger("search")}function onHeaderUserButtonClick(e){Dashboard.navigate("mypreferencesmenu.html")}function onHeaderHomeButtonClick(){Dashboard.navigate("home.html")}function showAudioPlayer(){return appRouter.showNowPlaying()}function onPlaybackStart(e){playbackManager.isPlayingAudio()&&layoutManager.tv?headerAudioPlayerButton.classList.remove("hide"):headerAudioPlayerButton.classList.add("hide")}function onPlaybackStop(e,stopInfo){"Audio"!=stopInfo.nextMediaType&&headerAudioPlayerButton.classList.add("hide")}function onCastButtonClicked(){var btn=this;require(["playerSelectionMenu"],function(playerSelectionMenu){playerSelectionMenu.show(btn)})}function onSyncButtonClicked(){groupSelectionMenu.show(this)}function toggleMainDrawer(){navDrawerInstance.isVisible?closeMainDrawer():(navDrawerInstance.open(),(new Date).getTime())}function closeMainDrawer(){navDrawerInstance.close()}function onMainDrawerSelect(e){navDrawerInstance.isVisible?layoutManager.mobile&&document.body.classList.add("bodyWithPopupOpen"):document.body.classList.remove("bodyWithPopupOpen")}function refreshDashboardInfoInDrawer(apiClient){currentDrawerType="admin",loadNavDrawer(),navDrawerScrollContainer.querySelector(".adminDrawerLogo")?updateDashboardMenuSelectedItem():function(apiClient){(function(apiClient){return function(apiClient){return apiClient.getJSON(apiClient.getUrl("web/configurationpages")+"?pageType=PluginConfiguration&EnableInMainMenu=true").then(createToolsMenuList,function(err){return createToolsMenuList([])})}(apiClient).then(function(items){var item,menuHtml="";menuHtml+='<div class="drawerContent">';for(var i=0;i<items.length;i++)(item=items[i]).href?menuHtml+=function(item){var menuHtml="",pageIds=item.pageIds?item.pageIds.join("|"):"";pageIds=pageIds?' data-pageids="'+pageIds+'"':"";var pageUrls=item.pageUrls?item.pageUrls.join("|"):"";return pageUrls=pageUrls?' data-pageurls="'+pageUrls+'"':"",menuHtml+='<a is="emby-linkbutton" class="navMenuOption" href="'+item.href+'"'+pageIds+pageUrls+">",item.icon&&(menuHtml+='<span class="material-icons navMenuOptionIcon '+item.icon+'"></span>'),menuHtml+='<span class="navMenuOptionText">',menuHtml+=item.name,(menuHtml+="</span>")+"</a>"}(item):item.name&&(menuHtml+='<h3 class="sidebarHeader">',menuHtml+=item.name,menuHtml+="</h3>");return menuHtml+"</div>"})})(apiClient).then(function(toolsMenuHtml){var html="";html+='<a class="adminDrawerLogo clearLink" is="emby-linkbutton" href="home.html">',html+='<img src="assets/img/icon-transparent.png" />',html+="</a>",html+=toolsMenuHtml,navDrawerScrollContainer.innerHTML=html,updateDashboardMenuSelectedItem()})}(apiClient)}function isUrlInCurrentView(url){return-1!==window.location.href.toString().toLowerCase().indexOf(url.toLowerCase())}function updateDashboardMenuSelectedItem(){for(var links=navDrawerScrollContainer.querySelectorAll(".navMenuOption"),currentViewId=viewManager.currentView().id,i=0,length=links.length;i<length;i++){var link=links[i],selected=!1,pageIds=link.getAttribute("data-pageids");pageIds&&(selected=-1!=(pageIds=pageIds.split("|")).indexOf(currentViewId));var title,pageUrls=link.getAttribute("data-pageurls");pageUrls&&(selected=0<(pageUrls=pageUrls.split("|")).filter(isUrlInCurrentView).length),selected?(link.classList.add("navMenuOption-selected"),title="",title+=((link=link.querySelector(".navMenuOptionText")||link).innerText||link.textContent).trim(),LibraryMenu.setTitle(title)):link.classList.remove("navMenuOption-selected")}}function createToolsMenuList(pluginItems){var links=[{name:globalize.translate("TabServer")},{name:globalize.translate("TabDashboard"),href:"dashboard.html",pageIds:["dashboardPage"],icon:"dashboard"},{name:globalize.translate("General"),href:"dashboardgeneral.html",pageIds:["dashboardGeneralPage"],icon:"settings"},{name:globalize.translate("TabUsers"),href:"userprofiles.html",pageIds:["userProfilesPage","newUserPage","editUserPage","userLibraryAccessPage","userParentalControlPage","userPasswordPage"],icon:"people"},{name:globalize.translate("HeaderLibraries"),href:"library.html",pageIds:["mediaLibraryPage","librarySettingsPage","libraryDisplayPage","metadataImagesConfigurationPage","metadataNfoPage"],icon:"folder"},{name:globalize.translate("TabPlayback"),icon:"play_arrow",href:"encodingsettings.html",pageIds:["encodingSettingsPage","playbackConfigurationPage","streamingSettingsPage"]}];return addPluginPagesToMainMenu(links,pluginItems,"server"),links.push({divider:!0,name:globalize.translate("TabDevices")}),links.push({name:globalize.translate("TabDevices"),href:"devices.html",pageIds:["devicesPage","devicePage"],icon:"devices"}),links.push({name:globalize.translate("HeaderActivity"),href:"serveractivity.html",pageIds:["serverActivityPage"],icon:"assessment"}),links.push({name:globalize.translate("DLNA"),href:"dlnasettings.html",pageIds:["dlnaSettingsPage","dlnaProfilesPage","dlnaProfilePage"],icon:"input"}),links.push({divider:!0,name:globalize.translate("TabLiveTV")}),links.push({name:globalize.translate("TabLiveTV"),href:"livetvstatus.html",pageIds:["liveTvStatusPage","liveTvTunerPage"],icon:"live_tv"}),links.push({name:globalize.translate("TabDVR"),href:"livetvsettings.html",pageIds:["liveTvSettingsPage"],icon:"dvr"}),links.push({divider:!0,name:globalize.translate("TabAdvanced")}),links.push({name:globalize.translate("TabNetworking"),icon:"cloud",href:"networking.html",pageIds:["networkingPage"]}),links.push({name:globalize.translate("HeaderApiKeys"),icon:"vpn_key",href:"apikeys.html",pageIds:["apiKeysPage"]}),links.push({name:globalize.translate("TabLogs"),href:"log.html",pageIds:["logPage"],icon:"bug_report"}),links.push({name:globalize.translate("TabNotifications"),icon:"notifications",href:"notificationsettings.html",pageIds:["notificationSettingsPage","notificationSettingPage"]}),links.push({name:globalize.translate("TabPlugins"),icon:"shopping_cart",href:"installedplugins.html",pageIds:["pluginsPage","pluginCatalogPage"]}),links.push({name:globalize.translate("TabScheduledTasks"),href:"scheduledtasks.html",pageIds:["scheduledTasksPage","scheduledTaskPage"],icon:"schedule"}),addPluginPagesToMainMenu(links,pluginItems),links}function addPluginPagesToMainMenu(links,pluginItems,section){for(var i=0,length=pluginItems.length;i<length;i++){var pluginItem=pluginItems[i];pluginItem.EnableInMainMenu&&pluginItem.MenuSection===section&&links.push({name:pluginItem.DisplayName,icon:pluginItem.MenuIcon||"folder",href:Dashboard.getConfigurationPageUrl(pluginItem.Name),pageUrls:[Dashboard.getConfigurationPageUrl(pluginItem.Name)]})}}function onSidebarLinkClick(){var section=this.getElementsByClassName("sectionName")[0],text=section?section.innerHTML:this.innerHTML;LibraryMenu.setTitle(text)}function showBySelector(selector,show){var elem=document.querySelector(selector);elem&&(show?elem.classList.remove("hide"):elem.classList.add("hide"))}function updateLibraryMenu(user){if(!user)return showBySelector(".libraryMenuDownloads",!1),showBySelector(".lnkSyncToOtherDevices",!1),showBySelector(".userMenuOptions",!1),0;user.Policy.EnableContentDownloading?showBySelector(".lnkSyncToOtherDevices",!0):showBySelector(".lnkSyncToOtherDevices",!1),user.Policy.EnableContentDownloading&&appHost.supports("sync")?showBySelector(".libraryMenuDownloads",!0):showBySelector(".libraryMenuDownloads",!1);var userId=Dashboard.getCurrentUserId(),apiClient=getCurrentApiClient(),libraryMenuOptions=document.querySelector(".libraryMenuOptions");libraryMenuOptions&&function(apiClient,userId){return apiClient.getUserViews({},userId).then(function(result){for(var items=result.Items,list=[],i=0,length=items.length;i<length;i++){var guideView,view=items[i];list.push(view),"livetv"==view.CollectionType&&(view.ImageTags={},view.icon="live_tv",(guideView=Object.assign({},view)).Name=globalize.translate("ButtonGuide"),guideView.ImageTags={},guideView.icon="dvr",guideView.url="livetv.html?tab=1",list.push(guideView))}return list})}(apiClient,userId).then(function(result){var items=result,html='<h3 class="sidebarHeader">'.concat(globalize.translate("HeaderMedia"),"</h3>");html+=items.map(function(i){var item,context,icon=i.icon||imageHelper.getLibraryIcon(i.CollectionType),itemId=i.Id;return'<a is="emby-linkbutton" data-itemid="'.concat(itemId,'" class="lnkMediaFolder navMenuOption" href="').concat((context=(item=i).CollectionType,appRouter.getRouteUrl(item,{context:context})),'">\n                                    <span class="material-icons navMenuOptionIcon ').concat(icon,'"></span>\n                                    <span class="sectionName navMenuOptionText">').concat(i.Name,"</span>\n                                  </a>")}).join(""),libraryMenuOptions.innerHTML=html;var _step,_iterator=_createForOfIteratorHelper(libraryMenuOptions.querySelectorAll(".navMenuOption"));try{for(_iterator.s();!(_step=_iterator.n()).done;){var sidebarLink=_step.value;sidebarLink.removeEventListener("click",onSidebarLinkClick),sidebarLink.addEventListener("click",onSidebarLinkClick)}}catch(err){_iterator.e(err)}finally{_iterator.f()}})}function getTopParentId(){return getParameterByName("topParentId")||null}function onMainDrawerClick(e){dom.parentWithTag(e.target,"A")&&setTimeout(closeMainDrawer,30)}function onSettingsClick(){Dashboard.navigate("mypreferencesmenu.html")}function onLogoutClick(){Dashboard.logout()}function loadNavDrawer(){return navDrawerInstance?Promise.resolve(navDrawerInstance):(navDrawerElement=document.querySelector(".mainDrawer"),(navDrawerScrollContainer=navDrawerElement.querySelector(".scrollContainer")).addEventListener("click",onMainDrawerClick),new Promise(function(resolve,reject){require(["navdrawer"],function(navdrawer){var drawerWidth;navDrawerInstance=new navdrawer((drawerWidth=screen.availWidth-50,drawerWidth=Math.max(drawerWidth,240),drawerWidth=Math.min(drawerWidth,320),{target:navDrawerElement,onChange:onMainDrawerSelect,width:drawerWidth})),layoutManager.tv||navDrawerElement.classList.remove("hide"),resolve(navDrawerInstance)})}))}var navDrawerElement,navDrawerScrollContainer,navDrawerInstance,mainDrawerButton,headerHomeButton,currentDrawerType,pageTitleElement,headerBackButton,headerUserButton,currentUser,headerCastButton,headerSearchButton,headerAudioPlayerButton,headerSyncButton,currentPageType,html,enableLibraryNavDrawer=layoutManager.desktop,enableLibraryNavDrawerHome=!layoutManager.tv,skinHeader=document.querySelector(".skinHeader"),requiresUserRefresh=!0;return(new Date).getTime(),window.LibraryMenu={getTopParentId:getTopParentId,onHardwareMenuButtonClick:function(){toggleMainDrawer()},setTabs:function(type,selectedIndex,builder){require(["mainTabsManager"],function(mainTabsManager){type?mainTabsManager.setTabs(viewManager.currentView(),selectedIndex,builder,function(){return[]}):mainTabsManager.setTabs(null)})},setDefaultTitle:function(){(pageTitleElement=pageTitleElement||document.querySelector(".pageTitle"))&&(pageTitleElement.classList.add("pageTitleWithLogo"),pageTitleElement.classList.add("pageTitleWithDefaultLogo"),pageTitleElement.style.backgroundImage=null,pageTitleElement.innerHTML=""),document.title="BlueBoxOfDOOM"},setTitle:function(title){var html;null!=title?("-"===title&&(title=""),html=title,(pageTitleElement=pageTitleElement||document.querySelector(".pageTitle"))&&(pageTitleElement.classList.remove("pageTitleWithLogo"),pageTitleElement.classList.remove("pageTitleWithDefaultLogo"),pageTitleElement.style.backgroundImage=null,pageTitleElement.innerHTML=html||""),document.title=title||"Jellyfin"):LibraryMenu.setDefaultTitle()},setTransparentMenu:function(transparent){transparent?skinHeader.classList.add("semiTransparent"):skinHeader.classList.remove("semiTransparent")}},pageClassOn("pagebeforeshow","page",function(e){this.classList.contains("withTabs")||LibraryMenu.setTabs(null)}),pageClassOn("pageshow","page",function(e){var page,title,user,isDashboardPage=this.classList.contains("type-interior"),isHomePage=this.classList.contains("homePage"),isLibraryPage=!isDashboardPage&&this.classList.contains("libraryPage"),apiClient=getCurrentApiClient();isDashboardPage?(mainDrawerButton&&mainDrawerButton.classList.remove("hide"),refreshDashboardInfoInDrawer(apiClient)):(mainDrawerButton&&(enableLibraryNavDrawer||isHomePage&&enableLibraryNavDrawerHome?mainDrawerButton.classList.remove("hide"):mainDrawerButton.classList.add("hide")),"library"!==currentDrawerType&&(loadNavDrawer(),currentDrawerType="library",user?Promise.resolve(user):connectionManager.user(getCurrentApiClient()).then(function(user){!function(user){var html="";html+='<div style="height:.5em;"></div>',html+='<img src="/web/logowhite.png" width=250px style="padding: 5px;display:block; margin-left: auto; margin-right: auto;">',html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder" href="home.html"><span class="material-icons navMenuOptionIcon home"></span><span class="navMenuOptionText">'+globalize.translate("ButtonHome")+"</span></a>",html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder" href="TOPLINKHERE"><i class="md-icon navMenuOptionIcon"><img src="TOPLINKICONHERE"></i><span class="navMenuOptionText">'+globalize.translate("TOPLINKNAMEHERE")+"</span></a>",html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder" href="2NDLINKHERE"><i class="md-icon navMenuOptionIcon"><img src="2NDLINKICONHERE"></i><span class="navMenuOptionText">'+globalize.translate("2NDLINKNAMEHERE")+"</span></a>",html+='<div class="libraryMenuOptions">',html+="</div>",user.localUser&&user.localUser.Policy.IsAdministrator&&(html+='<div class="adminMenuOptions">',html+='<h3 class="sidebarHeader">',html+=globalize.translate("HeaderAdmin"),html+="</h3>",html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder lnkManageServer" data-itemid="dashboard" href="dashboard.html"><span class="material-icons navMenuOptionIcon dashboard"></span><span class="navMenuOptionText">'+globalize.translate("TabDashboard")+"</span></a>",html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder editorViewMenu" data-itemid="editor" href="edititemmetadata.html"><span class="material-icons navMenuOptionIcon mode_edit"></span><span class="navMenuOptionText">'+globalize.translate("Metadata")+"</span></a>",html+="</div>"),user.localUser&&(html+='<div class="userMenuOptions">',html+='<h3 class="sidebarHeader">',html+=globalize.translate("HeaderUser"),html+="</h3>",appHost.supports("multiserver")&&(html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder" data-itemid="selectserver" href="selectserver.html?showuser=1"><span class="material-icons navMenuOptionIcon wifi"></span><span class="navMenuOptionText">'+globalize.translate("ButtonSelectServer")+"</span></a>"),html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder btnSettings" data-itemid="settings" href="#"><span class="material-icons navMenuOptionIcon settings"></span><span class="navMenuOptionText">'+globalize.translate("ButtonSettings")+"</span></a>",html+='<a is="emby-linkbutton" class="navMenuOption lnkMediaFolder btnLogout" data-itemid="logout" href="#"><span class="material-icons navMenuOptionIcon exit_to_app"></span><span class="navMenuOptionText">'+globalize.translate("ButtonSignOut")+"</span></a>",html+="</div>"),navDrawerScrollContainer.innerHTML=html;var btnSettings=navDrawerScrollContainer.querySelector(".btnSettings");btnSettings&&btnSettings.addEventListener("click",onSettingsClick);var btnLogout=navDrawerScrollContainer.querySelector(".btnLogout");btnLogout&&btnLogout.addEventListener("click",onLogoutClick)}(user),updateLibraryMenu(user.localUser)}))),function(isDashboardPage,isLibraryPage){var bodyClassList,newPageType=isDashboardPage?2:isLibraryPage?1:3;currentPageType!==newPageType&&(currentPageType=newPageType,isDashboardPage&&!layoutManager.mobile?skinHeader.classList.add("headroomDisabled"):skinHeader.classList.remove("headroomDisabled"),bodyClassList=document.body.classList,isLibraryPage?(bodyClassList.add("libraryDocument"),bodyClassList.remove("dashboardDocument"),bodyClassList.remove("hideMainDrawer"),navDrawerInstance&&navDrawerInstance.setEdgeSwipeEnabled(!0)):isDashboardPage?(bodyClassList.remove("libraryDocument"),bodyClassList.add("dashboardDocument"),bodyClassList.remove("hideMainDrawer"),navDrawerInstance&&navDrawerInstance.setEdgeSwipeEnabled(!0)):(bodyClassList.remove("libraryDocument"),bodyClassList.remove("dashboardDocument"),bodyClassList.add("hideMainDrawer"),navDrawerInstance&&navDrawerInstance.setEdgeSwipeEnabled(!1))),requiresUserRefresh&&connectionManager.user(getCurrentApiClient()).then(updateUserInHeader)}(isDashboardPage,isLibraryPage),e.detail.isRestored||window.scrollTo(0,0),(title=(page=this).getAttribute("data-title"))?LibraryMenu.setTitle(title):page.classList.contains("standalonePage")&&LibraryMenu.setDefaultTitle(),function(page){(headerBackButton=headerBackButton||document.querySelector(".headerBackButton"))&&("false"!==page.getAttribute("data-backbutton")&&appRouter.canGoBack()?headerBackButton.classList.remove("hide"):headerBackButton.classList.add("hide"))}(this),function(page){for(var isLiveTvPage=page.classList.contains("liveTvPage"),isChannelsPage=page.classList.contains("channelsPage"),isEditorPage=page.classList.contains("metadataEditorPage"),isMySyncPage=page.classList.contains("mySyncPage"),id=!(isLiveTvPage||isChannelsPage||isEditorPage||isMySyncPage||page.classList.contains("allLibraryPage"))&&getTopParentId()||"",elems=document.getElementsByClassName("lnkMediaFolder"),i=0,length=elems.length;i<length;i++){var lnkMediaFolder=elems[i],itemId=lnkMediaFolder.getAttribute("data-itemid");isChannelsPage&&"channels"===itemId||isLiveTvPage&&"livetv"===itemId||isEditorPage&&"editor"===itemId||isMySyncPage&&"manageoffline"===itemId&&-1!=window.location.href.toString().indexOf("mode=download")||isMySyncPage&&"syncotherdevices"===itemId&&-1==window.location.href.toString().indexOf("mode=download")||id&&itemId==id?lnkMediaFolder.classList.add("navMenuOption-selected"):lnkMediaFolder.classList.remove("navMenuOption-selected")}}(this)}),html="",html+='<div class="flex align-items-center flex-grow headerTop">',html+='<div class="headerLeft">',html+='<button type="button" is="paper-icon-button-light" class="headerButton headerButtonLeft headerBackButton hide"><span class="material-icons '+(browser.safari?"chevron_left":"arrow_back")+'"></span></button>',html+='<button type="button" is="paper-icon-button-light" class="headerButton headerHomeButton hide barsMenuButton headerButtonLeft"><span class="material-icons home"></span></button>',html+='<button type="button" is="paper-icon-button-light" class="headerButton mainDrawerButton barsMenuButton headerButtonLeft hide"><span class="material-icons menu"></span></button>',html+='<h3 class="pageTitle"></h3>',html+="</div>",html+='<div class="headerRight">',html+='<span class="headerSelectedPlayer"></span>',html+='<button is="paper-icon-button-light" class="headerSyncButton syncButton headerButton headerButtonRight hide" title="'.concat(globalize.translate("ButtonSyncPlay"),'"><span class="material-icons sync_disabled"></span></button>'),html+='<button is="paper-icon-button-light" class="headerAudioPlayerButton audioPlayerButton headerButton headerButtonRight hide" title="'.concat(globalize.translate("ButtonPlayer"),'"><span class="material-icons music_note"></span></button>'),html+='<button is="paper-icon-button-light" class="headerCastButton castButton headerButton headerButtonRight hide" title="'.concat(globalize.translate("ButtonCast"),'"><span class="material-icons cast"></span></button>'),html+='<button type="button" is="paper-icon-button-light" class="headerButton headerButtonRight headerSearchButton hide" title="'.concat(globalize.translate("ButtonSearch"),'"><span class="material-icons search"></span></button>'),html+='<button is="paper-icon-button-light" class="headerButton headerButtonRight headerUserButton hide"><span class="material-icons person"></span></button>',html+="</div>",html+="</div>",html+='<div class="headerTabs sectionTabs hide">',html+="</div>",skinHeader.classList.add("skinHeader-withBackground"),skinHeader.classList.add("skinHeader-blurred"),skinHeader.innerHTML=html,headerHomeButton=skinHeader.querySelector(".headerHomeButton"),headerUserButton=skinHeader.querySelector(".headerUserButton"),headerCastButton=skinHeader.querySelector(".headerCastButton"),headerAudioPlayerButton=skinHeader.querySelector(".headerAudioPlayerButton"),headerSearchButton=skinHeader.querySelector(".headerSearchButton"),headerSyncButton=skinHeader.querySelector(".headerSyncButton"),require(["imageLoader"],function(imageLoader){imageLoader.lazyChildren(skinHeader)}),function(){(mainDrawerButton=document.querySelector(".mainDrawerButton"))&&mainDrawerButton.addEventListener("click",toggleMainDrawer);var elem,headerBackButton=skinHeader.querySelector(".headerBackButton");headerBackButton&&headerBackButton.addEventListener("click",onBackClick),headerSearchButton&&headerSearchButton.addEventListener("click",showSearch),headerUserButton.addEventListener("click",onHeaderUserButtonClick),headerHomeButton.addEventListener("click",onHeaderHomeButtonClick),layoutManager.tv||headerCastButton.addEventListener("click",onCastButtonClicked),headerAudioPlayerButton.addEventListener("click",showAudioPlayer),headerSyncButton.addEventListener("click",onSyncButtonClicked),layoutManager.mobile&&(elem=skinHeader,require(["headroom"],function(Headroom){new Headroom(elem).init()})),events.on(playbackManager,"playbackstart",onPlaybackStart),events.on(playbackManager,"playbackstop",onPlaybackStop)}(),events.on(connectionManager,"localusersignedin",function(e,user){var currentApiClient=connectionManager.getApiClient(user.ServerId);currentDrawerType=null,currentUser={localUser:user},loadNavDrawer(),connectionManager.user(currentApiClient).then(function(user){updateUserInHeader(currentUser=user)})}),events.on(connectionManager,"localusersignedout",function(){currentUser={},updateUserInHeader()}),events.on(playbackManager,"playerchange",function(){var context=document,info=playbackManager.getPlayerInfo(),icon=headerCastButton.querySelector(".material-icons");icon.classList.remove("cast_connected","cast"),info&&!info.isLocalPlayer?(icon.classList.add("cast_connected"),headerCastButton.classList.add("castButton-active"),context.querySelector(".headerSelectedPlayer").innerHTML=info.deviceName||info.name):(icon.classList.add("cast"),headerCastButton.classList.remove("castButton-active"),context.querySelector(".headerSelectedPlayer").innerHTML="")}),events.on(syncPlayManager,"enabled",function(event,enabled){var icon=headerSyncButton.querySelector("span");icon.classList.remove("sync","sync_disabled","sync_problem"),enabled?icon.classList.add("sync"):icon.classList.add("sync_disabled")}),events.on(syncPlayManager,"syncing",function(event,is_syncing){var icon=headerSyncButton.querySelector("span");icon.classList.remove("sync","sync_disabled","sync_problem"),is_syncing?icon.classList.add("sync_problem"):icon.classList.add("sync")}),loadNavDrawer(),LibraryMenu});
