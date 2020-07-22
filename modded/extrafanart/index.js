"use strict";
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest()
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}
function _iterableToArrayLimit(arr, i) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(arr)) {
        var _arr = []
          , _n = !0
          , _d = !1
          , _e = void 0;
        try {
            for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value),
            !i || _arr.length !== i); _n = !0)
                ;
        } catch (err) {
            _d = !0,
            _e = err
        } finally {
            try {
                _n || null == _i.return || _i.return()
            } finally {
                if (_d)
                    throw _e
            }
        }
        return _arr
    }
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
        return arr
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if ("undefined" == typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" == typeof o.length) {
            it && (o = it);
            var i = 0
              , F = function F() {};
            return {
                s: F,
                n: function n() {
                    return i >= o.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: o[i++]
                    }
                },
                e: function e(_e2) {
                    throw _e2
                },
                f: F
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    var err, normalCompletion = !0, didErr = !1;
    return {
        s: function s() {
            it = o[Symbol.iterator]()
        },
        n: function n() {
            var step = it.next();
            return normalCompletion = step.done,
            step
        },
        e: function e(_e3) {
            didErr = !0,
            err = _e3
        },
        f: function f() {
            try {
                normalCompletion || null == it.return || it.return()
            } finally {
                if (didErr)
                    throw err
            }
        }
    }
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o)
            return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        return "Object" === n && o.constructor && (n = o.constructor.name),
        "Map" === n || "Set" === n ? Array.from(o) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _arrayLikeToArray(o, minLen) : void 0
    }
}
function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
    return arr2
}
define(["loading", "appRouter", "layoutManager", "connectionManager", "userSettings", "cardBuilder", "datetime", "mediaInfo", "backdrop", "listView", "itemContextMenu", "itemHelper", "dom", "indicators", "imageLoader", "libraryMenu", "globalize", "browser", "events", "playbackManager", "scrollStyles", "emby-itemscontainer", "emby-checkbox", "emby-button", "emby-playstatebutton", "emby-ratingbutton", "emby-scroller", "emby-select"], (function(loading, appRouter, layoutManager, connectionManager, userSettings, cardBuilder, datetime, mediaInfo, backdrop, listView, itemContextMenu, itemHelper, dom, indicators, imageLoader, libraryMenu, globalize, browser, events, playbackManager) {
    function getPromise(apiClient, params) {
        var id = params.id;
        if (id)
            return apiClient.getItem(apiClient.getCurrentUserId(), id);
        if (params.seriesTimerId)
            return apiClient.getLiveTvSeriesTimer(params.seriesTimerId);
        if (params.genre)
            return apiClient.getGenre(params.genre, apiClient.getCurrentUserId());
        if (params.musicgenre)
            return apiClient.getMusicGenre(params.musicgenre, apiClient.getCurrentUserId());
        if (params.musicartist)
            return apiClient.getArtist(params.musicartist, apiClient.getCurrentUserId());
        throw new Error("Invalid request")
    }
    function hideAll(page, className, show) {
        var _step, _iterator = _createForOfIteratorHelper(page.querySelectorAll("." + className));
        try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var elem = _step.value;
                show ? elem.classList.remove("hide") : elem.classList.add("hide")
            }
        } catch (err) {
            _iterator.e(err)
        } finally {
            _iterator.f()
        }
    }
    function getContextMenuOptions(item, user, button) {
        return {
            item: item,
            open: !1,
            play: !1,
            playAllFromHere: !1,
            queueAllFromHere: !1,
            positionTo: button,
            cancelTimer: !1,
            record: !1,
            deleteItem: !0 === item.CanDelete,
            shuffle: !1,
            instantMix: !1,
            user: user,
            share: !0
        }
    }
    function renderSeriesTimerSchedule(page, apiClient, seriesTimerId) {
        apiClient.getLiveTvTimers({
            UserId: apiClient.getCurrentUserId(),
            ImageTypeLimit: 1,
            EnableImageTypes: "Primary,Backdrop,Thumb",
            SortBy: "StartDate",
            EnableTotalRecordCount: !1,
            EnableUserData: !1,
            SeriesTimerId: seriesTimerId,
            Fields: "ChannelInfo,ChannelImage"
        }).then((function(result) {
            result.Items.length && result.Items[0].SeriesTimerId != seriesTimerId && (result.Items = []);
            var html = function getProgramScheduleHtml(items) {
                var html = "";
                return html += '<div is="emby-itemscontainer" class="itemsContainer vertical-list" data-contextmenu="false">',
                html += listView.getListViewHtml({
                    items: items,
                    enableUserDataButtons: !1,
                    image: !0,
                    imageSource: "channel",
                    showProgramDateTime: !0,
                    showChannel: !1,
                    mediaInfo: !1,
                    action: "none",
                    moreButton: !1,
                    recordButton: !1
                }),
                html += "</div>"
            }(result.Items)
              , scheduleTab = page.querySelector(".seriesTimerSchedule");
            scheduleTab.innerHTML = html,
            imageLoader.lazyChildren(scheduleTab)
        }
        ))
    }
    function renderTrackSelections(page, instance, item, forceReload) {
        var select = page.querySelector(".selectSource");
        if (!item.MediaSources || !itemHelper.supportsMediaSourceSelection(item) || -1 === playbackManager.getSupportedCommands().indexOf("PlayMediaSource") || !playbackManager.canPlay(item))
            return page.querySelector(".trackSelections").classList.add("hide"),
            select.innerHTML = "",
            page.querySelector(".selectVideo").innerHTML = "",
            page.querySelector(".selectAudio").innerHTML = "",
            void (page.querySelector(".selectSubtitles").innerHTML = "");
        var mediaSources = item.MediaSources;
        instance._currentPlaybackMediaSources = mediaSources,
        page.querySelector(".trackSelections").classList.remove("hide"),
        select.setLabel(globalize.translate("LabelVersion"));
        var currentValue = select.value
          , selectedId = mediaSources[0].Id;
        select.innerHTML = mediaSources.map((function(v) {
            var selected = v.Id === selectedId ? " selected" : "";
            return '<option value="' + v.Id + '"' + selected + ">" + v.Name + "</option>"
        }
        )).join(""),
        mediaSources.length > 1 ? page.querySelector(".selectSourceContainer").classList.remove("hide") : page.querySelector(".selectSourceContainer").classList.add("hide"),
        (select.value !== currentValue || forceReload) && (renderVideoSelections(page, mediaSources),
        renderAudioSelections(page, mediaSources),
        renderSubtitleSelections(page, mediaSources))
    }
    function renderVideoSelections(page, mediaSources) {
        var mediaSourceId = page.querySelector(".selectSource").value
          , tracks = mediaSources.filter((function(m) {
            return m.Id === mediaSourceId
        }
        ))[0].MediaStreams.filter((function(m) {
            return "Video" === m.Type
        }
        ))
          , select = page.querySelector(".selectVideo");
        select.setLabel(globalize.translate("LabelVideo"));
        var selectedId = tracks.length ? tracks[0].Index : -1;
        select.innerHTML = tracks.map((function(v) {
            var selected = v.Index === selectedId ? " selected" : ""
              , titleParts = []
              , resolutionText = mediaInfo.getResolutionText(v);
            return resolutionText && titleParts.push(resolutionText),
            v.Codec && titleParts.push(v.Codec.toUpperCase()),
            '<option value="' + v.Index + '" ' + selected + ">" + (v.DisplayTitle || titleParts.join(" ")) + "</option>"
        }
        )).join(""),
        select.setAttribute("disabled", "disabled"),
        tracks.length ? page.querySelector(".selectVideoContainer").classList.remove("hide") : page.querySelector(".selectVideoContainer").classList.add("hide")
    }
    function renderAudioSelections(page, mediaSources) {
        var mediaSourceId = page.querySelector(".selectSource").value
          , mediaSource = mediaSources.filter((function(m) {
            return m.Id === mediaSourceId
        }
        ))[0]
          , tracks = mediaSource.MediaStreams.filter((function(m) {
            return "Audio" === m.Type
        }
        ))
          , select = page.querySelector(".selectAudio");
        select.setLabel(globalize.translate("LabelAudio"));
        var selectedId = mediaSource.DefaultAudioStreamIndex;
        select.innerHTML = tracks.map((function(v) {
            var selected = v.Index === selectedId ? " selected" : "";
            return '<option value="' + v.Index + '" ' + selected + ">" + v.DisplayTitle + "</option>"
        }
        )).join(""),
        tracks.length > 1 ? select.removeAttribute("disabled") : select.setAttribute("disabled", "disabled"),
        tracks.length ? page.querySelector(".selectAudioContainer").classList.remove("hide") : page.querySelector(".selectAudioContainer").classList.add("hide")
    }
    function renderSubtitleSelections(page, mediaSources) {
        var mediaSourceId = page.querySelector(".selectSource").value
          , mediaSource = mediaSources.filter((function(m) {
            return m.Id === mediaSourceId
        }
        ))[0]
          , tracks = mediaSource.MediaStreams.filter((function(m) {
            return "Subtitle" === m.Type
        }
        ))
          , select = page.querySelector(".selectSubtitles");
        select.setLabel(globalize.translate("LabelSubtitles"));
        var selectedId = null == mediaSource.DefaultSubtitleStreamIndex ? -1 : mediaSource.DefaultSubtitleStreamIndex;
        if (mediaSource.MediaStreams.filter((function(m) {
            return "Video" === m.Type
        }
        )).length) {
            var selected = -1 === selectedId ? " selected" : "";
            select.innerHTML = '<option value="-1">' + globalize.translate("Off") + "</option>" + tracks.map((function(v) {
                return selected = v.Index === selectedId ? " selected" : "",
                '<option value="' + v.Index + '" ' + selected + ">" + v.DisplayTitle + "</option>"
            }
            )).join(""),
            tracks.length > 1 ? select.removeAttribute("disabled") : select.setAttribute("disabled", "disabled"),
            page.querySelector(".selectSubtitlesContainer").classList.remove("hide")
        } else
            select.innerHTML = "",
            page.querySelector(".selectSubtitlesContainer").classList.add("hide")
    }
    function reloadPlayButtons(page, item) {
        var canPlay = !1;
        if ("Program" == item.Type) {
            var now = new Date;
            now >= datetime.parseISO8601Date(item.StartDate, !0) && now < datetime.parseISO8601Date(item.EndDate, !0) ? (hideAll(page, "btnPlay", !0),
            canPlay = !0) : hideAll(page, "btnPlay"),
            hideAll(page, "btnResume"),
            hideAll(page, "btnInstantMix"),
            hideAll(page, "btnShuffle")
        } else if (playbackManager.canPlay(item)) {
            hideAll(page, "btnPlay", !0),
            hideAll(page, "btnInstantMix", -1 !== ["Audio", "MusicAlbum", "MusicGenre", "MusicArtist"].indexOf(item.Type)),
            hideAll(page, "btnShuffle", item.IsFolder || -1 !== ["MusicAlbum", "MusicGenre", "MusicArtist"].indexOf(item.Type)),
            canPlay = !0;
            var isResumable = item.UserData && item.UserData.PlaybackPositionTicks > 0;
            if (hideAll(page, "btnResume", isResumable),
            isResumable) {
                var _step2, _iterator2 = _createForOfIteratorHelper(page.querySelectorAll(".btnPlay"));
                try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                        _step2.value.querySelector(".detailButton-icon").classList.replace("play_arrow", "replay")
                    }
                } catch (err) {
                    _iterator2.e(err)
                } finally {
                    _iterator2.f()
                }
            }
        } else
            hideAll(page, "btnPlay"),
            hideAll(page, "btnResume"),
            hideAll(page, "btnInstantMix"),
            hideAll(page, "btnShuffle");
        return canPlay
    }
    function getArtistLinksHtml(artists, serverId, context) {
        var _step3, html = [], _iterator3 = _createForOfIteratorHelper(artists);
        try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
                var artist = _step3.value
                  , href = appRouter.getRouteUrl(artist, {
                    context: context,
                    itemType: "MusicArtist",
                    serverId: serverId
                });
                html.push('<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + href + '">' + artist.Name + "</a>")
            }
        } catch (err) {
            _iterator3.e(err)
        } finally {
            _iterator3.f()
        }
        return html = html.join(" / ")
    }
    function setTrailerButtonVisibility(page, item) {
        (item.LocalTrailerCount || item.RemoteTrailers && item.RemoteTrailers.length) && -1 !== playbackManager.getSupportedCommands().indexOf("PlayTrailers") ? hideAll(page, "btnPlayTrailer", !0) : hideAll(page, "btnPlayTrailer")
    }
    function reloadFromItem(instance, page, params, item, user) {
        var apiClient = connectionManager.getApiClient(item.ServerId);
        Emby.Page.setTitle(""),
        function renderImage(page, item) {
            !function renderDetailImage(elem, item, imageLoader) {
                var itemArray = [];
                itemArray.push(item);
                var cardHtml = cardBuilder.getCardsHtml(itemArray, {
                    shape: "auto",
                    showTitle: !1,
                    centerText: !0,
                    overlayText: !1,
                    transition: !1,
                    disableIndicators: !0,
                    disableHoverMenu: !0,
                    overlayPlayButton: !0,
                    width: .5 * dom.getWindowSize().innerWidth
                });
                elem.innerHTML = cardHtml,
                imageLoader.lazyChildren(elem)
            }(page.querySelector(".detailImageContainer"), item, imageLoader)
        }(page, item),
        function renderLogo(page, item, apiClient) {
            var detailLogo = page.querySelector(".detailLogo")
              , url = function logoImageUrl(item, apiClient, options) {
                if ((options = options || {}).type = "Logo",
                item.ImageTags && item.ImageTags.Logo)
                    return options.tag = item.ImageTags.Logo,
                    apiClient.getScaledImageUrl(item.Id, options);
                if (item.ParentLogoImageTag)
                    return options.tag = item.ParentLogoImageTag,
                    apiClient.getScaledImageUrl(item.ParentLogoItemId, options);
                return null
            }(item, apiClient, {});
            (layoutManager.mobile || userSettings.enableBackdrops()) && url ? (detailLogo.classList.remove("hide"),
            imageLoader.setLazyImage(detailLogo, url)) : detailLogo.classList.add("hide")
        }(page, item, apiClient),
        function renderBackdrop(item) {
            dom.getWindowSize().innerWidth >= 1e3 ? backdrop.setBackdrops([item]) : backdrop.clear()
        }(item),
        function renderDetailPageBackdrop(page, item, apiClient) {
            var imgUrl, hasbackdrop = !1, itemBackdropElement = page.querySelector("#itemBackdrop");
            return !(!layoutManager.mobile && !userSettings.detailsBanner()) && (item.BackdropImageTags && item.BackdropImageTags.length ? (imgUrl = apiClient.getScaledImageUrl(item.Id, {
                type: "Backdrop",
                maxWidth: dom.getScreenWidth(),
                index: 0,
                tag: item.BackdropImageTags[0]
            }),
            imageLoader.lazyImage(itemBackdropElement, imgUrl),
            hasbackdrop = !0) : item.ParentBackdropItemId && item.ParentBackdropImageTags && item.ParentBackdropImageTags.length ? (imgUrl = apiClient.getScaledImageUrl(item.ParentBackdropItemId, {
                type: "Backdrop",
                maxWidth: dom.getScreenWidth(),
                index: 0,
                tag: item.ParentBackdropImageTags[0]
            }),
            imageLoader.lazyImage(itemBackdropElement, imgUrl),
            hasbackdrop = !0) : itemBackdropElement.style.backgroundImage = "",
            hasbackdrop)
        }(page, item, apiClient),
        page.querySelector(".detailPagePrimaryContainer").classList.add("detailRibbon"),
        function renderName(item, container, context) {
            var parentRoute, parentNameHtml = [], parentNameLast = !1;
            item.AlbumArtists ? (parentNameHtml.push(getArtistLinksHtml(item.AlbumArtists, item.ServerId, context)),
            parentNameLast = !0) : item.ArtistItems && item.ArtistItems.length && "MusicVideo" === item.Type ? (parentNameHtml.push(getArtistLinksHtml(item.ArtistItems, item.ServerId, context)),
            parentNameLast = !0) : item.SeriesName && "Episode" === item.Type ? (parentRoute = appRouter.getRouteUrl({
                Id: item.SeriesId,
                Name: item.SeriesName,
                Type: "Series",
                IsFolder: !0,
                ServerId: item.ServerId
            }, {
                context: context
            }),
            parentNameHtml.push('<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + parentRoute + '">' + item.SeriesName + "</a>")) : (item.IsSeries || item.EpisodeTitle) && parentNameHtml.push(item.Name),
            item.SeriesName && "Season" === item.Type ? (parentRoute = appRouter.getRouteUrl({
                Id: item.SeriesId,
                Name: item.SeriesName,
                Type: "Series",
                IsFolder: !0,
                ServerId: item.ServerId
            }, {
                context: context
            }),
            parentNameHtml.push('<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + parentRoute + '">' + item.SeriesName + "</a>")) : null != item.ParentIndexNumber && "Episode" === item.Type ? (parentRoute = appRouter.getRouteUrl({
                Id: item.SeasonId,
                Name: item.SeasonName,
                Type: "Season",
                IsFolder: !0,
                ServerId: item.ServerId
            }, {
                context: context
            }),
            parentNameHtml.push('<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + parentRoute + '">' + item.SeasonName + "</a>")) : null != item.ParentIndexNumber && item.IsSeries ? parentNameHtml.push(item.SeasonName || "S" + item.ParentIndexNumber) : item.Album && item.AlbumId && ("MusicVideo" === item.Type || "Audio" === item.Type) ? (parentRoute = appRouter.getRouteUrl({
                Id: item.AlbumId,
                Name: item.Album,
                Type: "MusicAlbum",
                IsFolder: !0,
                ServerId: item.ServerId
            }, {
                context: context
            }),
            parentNameHtml.push('<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + parentRoute + '">' + item.Album + "</a>")) : item.Album && parentNameHtml.push(item.Album);
            var html = ""
              , tvShowHtml = parentNameHtml[0]
              , tvSeasonHtml = parentNameHtml[1];
            parentNameHtml.length && (html = parentNameLast ? layoutManager.mobile ? '<h3 class="parentName musicParentName">' + parentNameHtml.join("</br>") + "</h3>" : '<h3 class="parentName musicParentName">' + parentNameHtml.join(" - ") + "</h3>" : '<h1 class="parentName">' + tvShowHtml + "</h1>");
            var name = itemHelper.getDisplayName(item, {
                includeParentInfo: !1
            });
            html && !parentNameLast ? html += tvSeasonHtml ? '<h3 class="itemName infoText subtitle">' + tvSeasonHtml + " - " + name + "</h3>" : '<h3 class="itemName infoText subtitle">' + name + "</h3>" : html = item.OriginalTitle && item.OriginalTitle != item.Name ? '<h1 class="itemName infoText parentNameLast withOriginalTitle">' + name + "</h1>" + html : '<h1 class="itemName infoText parentNameLast">' + name + "</h1>" + html,
            item.OriginalTitle && item.OriginalTitle != item.Name && (html += '<h4 class="itemName infoText originalTitle">' + item.OriginalTitle + "</h4>"),
            container.innerHTML = html,
            html.length ? container.classList.remove("hide") : container.classList.add("hide")
        }(item, page.querySelector(".nameContainer"), params.context),
        renderDetails(page, item, apiClient, params.context),
        renderTrackSelections(page, instance, item),
        function renderSeriesTimerEditor(page, item, apiClient, user) {
            if ("SeriesTimer" === item.Type) {
                if (user.Policy.EnableLiveTvManagement)
                    return require(["seriesRecordingEditor"], (function(seriesRecordingEditor) {
                        seriesRecordingEditor.embed(item, apiClient.serverId(), {
                            context: page.querySelector(".seriesRecordingEditor")
                        })
                    }
                    )),
                    page.querySelector(".seriesTimerScheduleSection").classList.remove("hide"),
                    hideAll(page, "btnCancelSeriesTimer", !0),
                    void renderSeriesTimerSchedule(page, apiClient, item.Id);
                page.querySelector(".seriesTimerScheduleSection").classList.add("hide"),
                hideAll(page, "btnCancelSeriesTimer")
            } else
                hideAll(page, "btnCancelSeriesTimer")
        }(page, item, apiClient, user),
        function renderTimerEditor(page, item, apiClient, user) {
            "Recording" === item.Type && user.Policy.EnableLiveTvManagement && item.TimerId && "InProgress" === item.Status ? hideAll(page, "btnCancelTimer", !0) : hideAll(page, "btnCancelTimer")
        }(page, item, 0, user),
        setInitialCollapsibleState(page, item, apiClient, params.context, user);
        var canPlay = reloadPlayButtons(page, item);
        (item.LocalTrailerCount || item.RemoteTrailers && item.RemoteTrailers.length) && -1 !== playbackManager.getSupportedCommands().indexOf("PlayTrailers") ? hideAll(page, "btnPlayTrailer", !0) : hideAll(page, "btnPlayTrailer"),
        setTrailerButtonVisibility(page, item),
        "Program" !== item.Type || canPlay ? hideAll(page, "mainDetailButtons", !0) : hideAll(page, "mainDetailButtons"),
        function showRecordingFields(instance, page, item, user) {
            if (!instance.currentRecordingFields) {
                var recordingFieldsElement = page.querySelector(".recordingFields");
                "Program" == item.Type && user.Policy.EnableLiveTvManagement ? require(["recordingFields"], (function(recordingFields) {
                    instance.currentRecordingFields = new recordingFields({
                        parent: recordingFieldsElement,
                        programId: item.Id,
                        serverId: item.ServerId
                    }),
                    recordingFieldsElement.classList.remove("hide")
                }
                )) : (recordingFieldsElement.classList.add("hide"),
                recordingFieldsElement.innerHTML = "")
            }
        }(instance, page, item, user);
        var groupedVersions = (item.MediaSources || []).filter((function(g) {
            return "Grouping" == g.Type
        }
        ));
        user.Policy.IsAdministrator && groupedVersions.length ? page.querySelector(".btnSplitVersions").classList.remove("hide") : page.querySelector(".btnSplitVersions").classList.add("hide"),
        itemContextMenu.getCommands(getContextMenuOptions(item, user)).length ? hideAll(page, "btnMoreCommands", !0) : hideAll(page, "btnMoreCommands");
        var itemBirthday = page.querySelector("#itemBirthday");
        if ("Person" == item.Type && item.PremiereDate)
            try {
                var birthday = datetime.parseISO8601Date(item.PremiereDate, !0).toDateString();
                itemBirthday.classList.remove("hide"),
                itemBirthday.innerHTML = globalize.translate("BirthDateValue", birthday)
            } catch (err) {
                itemBirthday.classList.add("hide")
            }
        else
            itemBirthday.classList.add("hide");
        var itemDeathDate = page.querySelector("#itemDeathDate");
        if ("Person" == item.Type && item.EndDate)
            try {
                var deathday = datetime.parseISO8601Date(item.EndDate, !0).toDateString();
                itemDeathDate.classList.remove("hide"),
                itemDeathDate.innerHTML = globalize.translate("DeathDateValue", deathday)
            } catch (err) {
                itemDeathDate.classList.add("hide")
            }
        else
            itemDeathDate.classList.add("hide");
        var itemBirthLocation = page.querySelector("#itemBirthLocation");
        if ("Person" == item.Type && item.ProductionLocations && item.ProductionLocations.length) {
            var gmap = '<a is="emby-linkbutton" class="button-link textlink" target="_blank" href="https://maps.google.com/maps?q=' + item.ProductionLocations[0] + '">' + item.ProductionLocations[0] + "</a>";
            itemBirthLocation.classList.remove("hide"),
            itemBirthLocation.innerHTML = globalize.translate("BirthPlaceValue", gmap)
        } else
            itemBirthLocation.classList.add("hide");
        !function setPeopleHeader(page, item) {
            "Audio" == item.MediaType || "MusicAlbum" == item.Type || "Book" == item.MediaType || "Photo" == item.MediaType ? page.querySelector("#peopleHeader").innerHTML = globalize.translate("HeaderPeople") : page.querySelector("#peopleHeader").innerHTML = globalize.translate("HeaderCastAndCrew")
        }(page, item),
        loading.hide(),
        "Book" === item.Type && hideAll(page, "btnDownload", !0),
        require(["autoFocuser"], (function(autoFocuser) {
            autoFocuser.autoFocus(page)
        }
        ))
    }
    function refreshImage(page, item) {
        !function refreshDetailImageUserData(elem, item) {
            elem.querySelector(".detailImageProgressContainer").innerHTML = indicators.getProgressBarHtml(item)
        }(page.querySelector(".detailImageContainer"), item)
    }
    function setInitialCollapsibleState(page, item, apiClient, context, user) {
        page.querySelector(".collectionItems").innerHTML = "",
        "Playlist" == item.Type ? (page.querySelector("#childrenCollapsible").classList.remove("hide"),
        function renderPlaylistItems(page, item) {
            require("scripts/playlistedit".split(","), (function() {
                PlaylistViewer.render(page, item)
            }
            ))
        }(page, item)) : "Studio" == item.Type || "Person" == item.Type || "Genre" == item.Type || "MusicGenre" == item.Type || "MusicArtist" == item.Type ? (page.querySelector("#childrenCollapsible").classList.remove("hide"),
        function renderItemsByName(page, item) {
            require("scripts/itembynamedetailpage".split(","), (function() {
                window.ItemsByName.renderItems(page, item)
            }
            ))
        }(page, item)) : item.IsFolder ? ("BoxSet" == item.Type && page.querySelector("#childrenCollapsible").classList.add("hide"),
        renderChildren(page, item)) : page.querySelector("#childrenCollapsible").classList.add("hide"),
        "Series" == item.Type ? (!function renderSeriesSchedule(page, item) {
            var apiClient = connectionManager.getApiClient(item.ServerId);
            apiClient.getLiveTvPrograms({
                UserId: apiClient.getCurrentUserId(),
                HasAired: !1,
                SortBy: "StartDate",
                EnableTotalRecordCount: !1,
                EnableImages: !1,
                ImageTypeLimit: 0,
                Limit: 50,
                EnableUserData: !1,
                LibrarySeriesId: item.Id
            }).then((function(result) {
                result.Items.length ? page.querySelector("#seriesScheduleSection").classList.remove("hide") : page.querySelector("#seriesScheduleSection").classList.add("hide"),
                page.querySelector("#seriesScheduleList").innerHTML = listView.getListViewHtml({
                    items: result.Items,
                    enableUserDataButtons: !1,
                    showParentTitle: !1,
                    image: !1,
                    showProgramDateTime: !0,
                    mediaInfo: !1,
                    showTitle: !0,
                    moreButton: !1,
                    action: "programdialog"
                }),
                loading.hide()
            }
            ))
        }(page, item),
        function renderNextUp(page, item, user) {
            var section = page.querySelector(".nextUpSection");
            "Series" == item.Type ? connectionManager.getApiClient(item.ServerId).getNextUpEpisodes({
                SeriesId: item.Id,
                UserId: user.Id
            }).then((function(result) {
                result.Items.length ? section.classList.remove("hide") : section.classList.add("hide");
                var html = cardBuilder.getCardsHtml({
                    items: result.Items,
                    shape: "overflowBackdrop",
                    showTitle: !0,
                    displayAsSpecial: "Season" == item.Type && item.IndexNumber,
                    overlayText: !1,
                    centerText: !0,
                    overlayPlayButton: !0
                })
                  , itemsContainer = section.querySelector(".nextUpItems");
                itemsContainer.innerHTML = html,
                imageLoader.lazyChildren(itemsContainer)
            }
            )) : section.classList.add("hide")
        }(page, item, user)) : page.querySelector(".nextUpSection").classList.add("hide"),
        renderScenes(page, item),
        item.SpecialFeatureCount && 0 != item.SpecialFeatureCount && "Series" != item.Type ? (page.querySelector("#specialsCollapsible").classList.remove("hide"),
        renderSpecials(page, item, user, 6)) : page.querySelector("#specialsCollapsible").classList.add("hide"),
        renderCast(page, item),
        item.PartCount && item.PartCount > 1 ? (page.querySelector("#additionalPartsCollapsible").classList.remove("hide"),
        function renderAdditionalParts(page, item, user) {
            connectionManager.getApiClient(item.ServerId).getAdditionalVideoParts(user.Id, item.Id).then((function(result) {
                if (result.Items.length) {
                    page.querySelector("#additionalPartsCollapsible").classList.remove("hide");
                    var additionalPartsContent = page.querySelector("#additionalPartsContent");
                    additionalPartsContent.innerHTML = getVideosHtml(result.Items, user),
                    imageLoader.lazyChildren(additionalPartsContent)
                } else
                    page.querySelector("#additionalPartsCollapsible").classList.add("hide")
            }
            ))
        }(page, item, user)) : page.querySelector("#additionalPartsCollapsible").classList.add("hide"),
        "MusicAlbum" == item.Type ? function renderMusicVideos(page, item, user) {
            connectionManager.getApiClient(item.ServerId).getItems(user.Id, {
                SortBy: "SortName",
                SortOrder: "Ascending",
                IncludeItemTypes: "MusicVideo",
                Recursive: !0,
                Fields: "PrimaryImageAspectRatio,BasicSyncInfo,CanDelete,MediaSourceCount",
                AlbumIds: item.Id
            }).then((function(result) {
                if (result.Items.length) {
                    page.querySelector("#musicVideosCollapsible").classList.remove("hide");
                    var musicVideosContent = page.querySelector(".musicVideosContent");
                    musicVideosContent.innerHTML = getVideosHtml(result.Items, user),
                    imageLoader.lazyChildren(musicVideosContent)
                } else
                    page.querySelector("#musicVideosCollapsible").classList.add("hide")
            }
            ))
        }(page, item, user) : page.querySelector("#musicVideosCollapsible").classList.add("hide")
    }
    function toggleLineClamp(clampTarget, e) {
        var expandButton = e.target;
        clampTarget.classList.contains("detail-clamp-text") ? (clampTarget.classList.remove("detail-clamp-text"),
        expandButton.innerHTML = globalize.translate("ShowLess")) : (clampTarget.classList.add("detail-clamp-text"),
        expandButton.innerHTML = globalize.translate("ShowMore"))
    }
    function renderDetails(page, item, apiClient, context, isStatic) {
        !function renderSimilarItems(page, item, context) {
            var similarCollapsible = page.querySelector("#similarCollapsible");
            if (similarCollapsible) {
                if ("Movie" != item.Type && "Trailer" != item.Type && "Series" != item.Type && "Program" != item.Type && "Recording" != item.Type && "MusicAlbum" != item.Type && "MusicArtist" != item.Type && "Playlist" != item.Type)
                    return void similarCollapsible.classList.add("hide");
                similarCollapsible.classList.remove("hide");
                var apiClient = connectionManager.getApiClient(item.ServerId)
                  , options = {
                    userId: apiClient.getCurrentUserId(),
                    limit: 12,
                    fields: "PrimaryImageAspectRatio,UserData,CanDelete"
                };
                "MusicAlbum" == item.Type && item.AlbumArtists && item.AlbumArtists.length && (options.ExcludeArtistIds = item.AlbumArtists[0].Id),
                apiClient.getSimilarItems(item.Id, options).then((function(result) {
                    if (result.Items.length) {
                        similarCollapsible.classList.remove("hide");
                        var html = "";
                        html += cardBuilder.getCardsHtml({
                            items: result.Items,
                            shape: "autooverflow",
                            showParentTitle: "MusicAlbum" == item.Type,
                            centerText: !0,
                            showTitle: !0,
                            context: context,
                            lazy: !0,
                            showDetailsMenu: !0,
                            coverImage: "MusicAlbum" == item.Type || "MusicArtist" == item.Type,
                            overlayPlayButton: !0,
                            overlayText: !1,
                            showYear: "Movie" === item.Type || "Trailer" === item.Type || "Series" === item.Type
                        });
                        var similarContent = similarCollapsible.querySelector(".similarContent");
                        similarContent.innerHTML = html,
                        imageLoader.lazyChildren(similarContent)
                    } else
                        similarCollapsible.classList.add("hide")
                }
                ))
            }
        }(page, item, context),
        function renderMoreFromSeason(view, item, apiClient) {
            var section = view.querySelector(".moreFromSeasonSection");
            if (section) {
                if ("Episode" !== item.Type || !item.SeasonId || !item.SeriesId)
                    return void section.classList.add("hide");
                var userId = apiClient.getCurrentUserId();
                apiClient.getEpisodes(item.SeriesId, {
                    SeasonId: item.SeasonId,
                    UserId: userId,
                    Fields: "ItemCounts,PrimaryImageAspectRatio,BasicSyncInfo,CanDelete,MediaSourceCount"
                }).then((function(result) {
                    if (result.Items.length < 2)
                        section.classList.add("hide");
                    else {
                        section.classList.remove("hide"),
                        section.querySelector("h2").innerHTML = globalize.translate("MoreFromValue", item.SeasonName);
                        var itemsContainer = section.querySelector(".itemsContainer");
                        cardBuilder.buildCards(result.Items, {
                            parentContainer: section,
                            itemsContainer: itemsContainer,
                            shape: "autooverflow",
                            sectionTitleTagName: "h2",
                            scalable: !0,
                            showTitle: !0,
                            overlayText: !1,
                            centerText: !0,
                            includeParentInfoInTitle: !1,
                            allowBottomPadding: !1
                        });
                        var card = itemsContainer.querySelector('.card[data-id="' + item.Id + '"]');
                        card && setTimeout((function() {
                            section.querySelector(".emby-scroller").toStart(card.previousSibling || card, !0)
                        }
                        ), 100)
                    }
                }
                ))
            }
        }(page, item, apiClient),
        function renderMoreFromArtist(view, item, apiClient) {
            var section = view.querySelector(".moreFromArtistSection");
            if (section) {
                if ("MusicArtist" === item.Type) {
                    if (!apiClient.isMinServerVersion("3.4.1.19"))
                        return void section.classList.add("hide")
                } else if ("MusicAlbum" !== item.Type || !item.AlbumArtists || !item.AlbumArtists.length)
                    return void section.classList.add("hide");
                var query = {
                    IncludeItemTypes: "MusicAlbum",
                    Recursive: !0,
                    ExcludeItemIds: item.Id,
                    SortBy: "ProductionYear,SortName",
                    SortOrder: "Descending"
                };
                "MusicArtist" === item.Type ? query.ContributingArtistIds = item.Id : apiClient.isMinServerVersion("3.4.1.18") ? query.AlbumArtistIds = item.AlbumArtists[0].Id : query.ArtistIds = item.AlbumArtists[0].Id,
                apiClient.getItems(apiClient.getCurrentUserId(), query).then((function(result) {
                    result.Items.length ? (section.classList.remove("hide"),
                    "MusicArtist" === item.Type ? section.querySelector("h2").innerHTML = globalize.translate("HeaderAppearsOn") : section.querySelector("h2").innerHTML = globalize.translate("MoreFromValue", item.AlbumArtists[0].Name),
                    cardBuilder.buildCards(result.Items, {
                        parentContainer: section,
                        itemsContainer: section.querySelector(".itemsContainer"),
                        shape: "autooverflow",
                        sectionTitleTagName: "h2",
                        scalable: !0,
                        coverImage: "MusicArtist" === item.Type || "MusicAlbum" === item.Type,
                        showTitle: !0,
                        showParentTitle: !1,
                        centerText: !0,
                        overlayText: !1,
                        overlayPlayButton: !0,
                        showYear: !0
                    })) : section.classList.add("hide")
                }
                ))
            }
        }(page, item, apiClient),
        function renderDirector(page, item, context) {
            var directors = (item.People || []).filter((function(person) {
                return "Director" === person.Type
            }
            ))
              , html = directors.map((function(person) {
                return '<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + appRouter.getRouteUrl({
                    Name: person.Name,
                    Type: "Person",
                    ServerId: item.ServerId,
                    Id: person.Id
                }, {
                    context: context
                }) + '">' + person.Name + "</a>"
            }
            )).join(", ");
            page.querySelector(".directorsLabel").innerHTML = globalize.translate(directors.length > 1 ? "Directors" : "Director"),
            page.querySelector(".directors").innerHTML = html;
            var directorsGroup = page.querySelector(".directorsGroup");
            directors.length ? directorsGroup.classList.remove("hide") : directorsGroup.classList.add("hide")
        }(page, item, context),
        function renderWriter(page, item, context) {
            var writers = (item.People || []).filter((function(person) {
                return "Writer" === person.Type
            }
            ))
              , html = writers.map((function(person) {
                return '<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + appRouter.getRouteUrl({
                    Name: person.Name,
                    Type: "Person",
                    ServerId: item.ServerId,
                    Id: person.Id
                }, {
                    context: context
                }) + '">' + person.Name + "</a>"
            }
            )).join(", ");
            page.querySelector(".writersLabel").innerHTML = globalize.translate(writers.length > 1 ? "Writers" : "Writer"),
            page.querySelector(".writers").innerHTML = html;
            var writersGroup = page.querySelector(".writersGroup");
            writers.length ? writersGroup.classList.remove("hide") : writersGroup.classList.add("hide")
        }(page, item, context),
        function renderGenres(page, item) {
            var context = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : inferContext(item)
              , genres = item.GenreItems || []
              , type = "music" === context ? "MusicGenre" : "Genre"
              , html = genres.map((function(p) {
                return '<a style="color:inherit;" class="button-link" is="emby-linkbutton" href="' + appRouter.getRouteUrl({
                    Name: p.Name,
                    Type: type,
                    ServerId: item.ServerId,
                    Id: p.Id
                }, {
                    context: context
                }) + '">' + p.Name + "</a>"
            }
            )).join(", ")
              , genresLabel = page.querySelector(".genresLabel");
            genresLabel.innerHTML = globalize.translate(genres.length > 1 ? "Genres" : "Genre");
            var genresValue = page.querySelector(".genres");
            genresValue.innerHTML = html;
            var genresGroup = page.querySelector(".genresGroup");
            genres.length ? genresGroup.classList.remove("hide") : genresGroup.classList.add("hide")
        }(page, item, context),
        function renderChannelGuide(page, apiClient, item) {
            "TvChannel" === item.Type && (page.querySelector(".programGuideSection").classList.remove("hide"),
            apiClient.getLiveTvPrograms({
                ChannelIds: item.Id,
                UserId: apiClient.getCurrentUserId(),
                HasAired: !1,
                SortBy: "StartDate",
                EnableTotalRecordCount: !1,
                EnableImages: !1,
                ImageTypeLimit: 0,
                EnableUserData: !1
            }).then((function(result) {
                !function renderProgramsForChannel(page, result) {
                    for (var html = "", currentItems = [], currentStartDate = null, i = 0, length = result.Items.length; i < length; i++) {
                        var item = result.Items[i]
                          , itemStartDate = datetime.parseISO8601Date(item.StartDate);
                        currentStartDate && currentStartDate.toDateString() === itemStartDate.toDateString() || (currentItems.length && (html += '<div class="verticalSection verticalDetailSection">',
                        html += '<h2 class="sectionTitle padded-left">' + datetime.toLocaleDateString(currentStartDate, {
                            weekday: "long",
                            month: "long",
                            day: "numeric"
                        }) + "</h2>",
                        html += '<div is="emby-itemscontainer" class="vertical-list padded-left padded-right">' + listView.getListViewHtml({
                            items: currentItems,
                            enableUserDataButtons: !1,
                            showParentTitle: !0,
                            image: !1,
                            showProgramTime: !0,
                            mediaInfo: !1,
                            parentTitleWithTitle: !0
                        }) + "</div></div>"),
                        currentStartDate = itemStartDate,
                        currentItems = []),
                        currentItems.push(item)
                    }
                    currentItems.length && (html += '<div class="verticalSection verticalDetailSection">',
                    html += '<h2 class="sectionTitle padded-left">' + datetime.toLocaleDateString(currentStartDate, {
                        weekday: "long",
                        month: "long",
                        day: "numeric"
                    }) + "</h2>",
                    html += '<div is="emby-itemscontainer" class="vertical-list padded-left padded-right">' + listView.getListViewHtml({
                        items: currentItems,
                        enableUserDataButtons: !1,
                        showParentTitle: !0,
                        image: !1,
                        showProgramTime: !0,
                        mediaInfo: !1,
                        parentTitleWithTitle: !0
                    }) + "</div></div>");
                    page.querySelector(".programGuide").innerHTML = html
                }(page, result)
            }
            )))
        }(page, apiClient, item),
        function renderTagline(page, item) {
            var taglineElement = page.querySelector(".tagline");
            item.Taglines && item.Taglines.length ? (taglineElement.classList.remove("hide"),
            taglineElement.innerHTML = item.Taglines[0]) : taglineElement.classList.add("hide")
        }(page, item),
        function renderOverview(page, item) {
            var _step5, _iterator5 = _createForOfIteratorHelper(page.querySelectorAll(".overview"));
            try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
                    var overviewElemnt = _step5.value
                      , overview = item.Overview || "";
                    if (overview) {
                        overviewElemnt.innerHTML = overview,
                        overviewElemnt.classList.remove("hide"),
                        overviewElemnt.classList.add("detail-clamp-text");
                        var expandButton = overviewElemnt.parentElement.querySelector(".overview-expand");
                        Math.abs(overviewElemnt.scrollHeight - overviewElemnt.offsetHeight) > 2 ? expandButton.classList.remove("hide") : expandButton.classList.add("hide"),
                        expandButton.addEventListener("click", toggleLineClamp.bind(null, overviewElemnt));
                        var _step6, _iterator6 = _createForOfIteratorHelper(overviewElemnt.querySelectorAll("a"));
                        try {
                            for (_iterator6.s(); !(_step6 = _iterator6.n()).done; ) {
                                _step6.value.setAttribute("target", "_blank")
                            }
                        } catch (err) {
                            _iterator6.e(err)
                        } finally {
                            _iterator6.f()
                        }
                    } else
                        overviewElemnt.innerHTML = "",
                        overviewElemnt.classList.add("hide")
                }
            } catch (err) {
                _iterator5.e(err)
            } finally {
                _iterator5.f()
            }
        }(page, item),
        function renderMiscInfo(page, item) {
            var _step7, _iterator7 = _createForOfIteratorHelper(page.querySelectorAll(".itemMiscInfo-primary"));
            try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done; ) {
                    var miscInfo = _step7.value;
                    mediaInfo.fillPrimaryMediaInfo(miscInfo, item, {
                        interactive: !0,
                        episodeTitle: !1,
                        subtitles: !1
                    }),
                    miscInfo.innerHTML && "SeriesTimer" !== item.Type ? miscInfo.classList.remove("hide") : miscInfo.classList.add("hide")
                }
            } catch (err) {
                _iterator7.e(err)
            } finally {
                _iterator7.f()
            }
            var _step8, _iterator8 = _createForOfIteratorHelper(page.querySelectorAll(".itemMiscInfo-secondary"));
            try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done; ) {
                    var _miscInfo = _step8.value;
                    mediaInfo.fillSecondaryMediaInfo(_miscInfo, item, {
                        interactive: !0
                    }),
                    _miscInfo.innerHTML && "SeriesTimer" !== item.Type ? _miscInfo.classList.remove("hide") : _miscInfo.classList.add("hide")
                }
            } catch (err) {
                _iterator8.e(err)
            } finally {
                _iterator8.f()
            }
        }(page, item),
        function reloadUserDataButtons(page, item) {
            var i, length, btnPlaystates = page.querySelectorAll(".btnPlaystate");
            for (i = 0,
            length = btnPlaystates.length; i < length; i++) {
                var btnPlaystate = btnPlaystates[i];
                itemHelper.canMarkPlayed(item) ? (btnPlaystate.classList.remove("hide"),
                btnPlaystate.setItem(item)) : (btnPlaystate.classList.add("hide"),
                btnPlaystate.setItem(null))
            }
            var btnUserRatings = page.querySelectorAll(".btnUserRating");
            for (i = 0,
            length = btnUserRatings.length; i < length; i++) {
                var btnUserRating = btnUserRatings[i];
                itemHelper.canRate(item) ? (btnUserRating.classList.remove("hide"),
                btnUserRating.setItem(item)) : (btnUserRating.classList.add("hide"),
                btnUserRating.setItem(null))
            }
        }(page, item),
        function renderLinks(page, item) {
            var externalLinksElem = page.querySelector(".itemExternalLinks")
              , links = [];
            if (!layoutManager.tv && item.HomePageUrl && links.push('<a is="emby-linkbutton" class="button-link" href="'.concat(item.HomePageUrl, '" target="_blank">').concat(globalize.translate("ButtonWebsite"), "</a>")),
            item.ExternalUrls) {
                var _step4, _iterator4 = _createForOfIteratorHelper(item.ExternalUrls);
                try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
                        var url = _step4.value;
                        links.push('<a is="emby-linkbutton" class="button-link" href="'.concat(url.Url, '" target="_blank">').concat(url.Name, "</a>"))
                    }
                } catch (err) {
                    _iterator4.e(err)
                } finally {
                    _iterator4.f()
                }
            }
            var html = [];
            links.length && html.push(links.join(", ")),
            externalLinksElem.innerHTML = html.join(", "),
            html.length ? externalLinksElem.classList.remove("hide") : externalLinksElem.classList.add("hide")
        }(page, item),
        function renderTags(page, item) {
            var itemTags = page.querySelector(".itemTags")
              , tagElements = []
              , tags = item.Tags || [];
            "Program" === item.Type && (tags = []);
            for (var i = 0, length = tags.length; i < length; i++)
                tagElements.push(tags[i]);
            tagElements.length ? (itemTags.innerHTML = globalize.translate("TagsValue", tagElements.join(", ")),
            itemTags.classList.remove("hide")) : (itemTags.innerHTML = "",
            itemTags.classList.add("hide"))
        }(page, item),
        function renderSeriesAirTime(page, item, isStatic) {
            var seriesAirTime = page.querySelector("#seriesAirTime");
            if ("Series" != item.Type)
                return void seriesAirTime.classList.add("hide");
            var html = "";
            item.AirDays && item.AirDays.length && (7 == item.AirDays.length ? html += "daily" : html += item.AirDays.map((function(a) {
                return a + "s"
            }
            )).join(","));
            item.AirTime && (html += " at " + item.AirTime);
            if (item.Studios.length)
                if (isStatic)
                    html += " on " + item.Studios[0].Name;
                else {
                    var context = inferContext(item)
                      , href = appRouter.getRouteUrl(item.Studios[0], {
                        context: context,
                        itemType: "Studio",
                        serverId: item.ServerId
                    });
                    html += ' on <a class="textlink button-link" is="emby-linkbutton" href="' + href + '">' + item.Studios[0].Name + "</a>"
                }
            html ? (html = ("Ended" == item.Status ? "Aired " : "Airs ") + html,
            seriesAirTime.innerHTML = html,
            seriesAirTime.classList.remove("hide")) : seriesAirTime.classList.add("hide")
        }(page, item, isStatic)
    }
    function enableScrollX() {
        return browser.mobile && screen.availWidth <= 1e3
    }
    function renderChildren(page, item) {
        var promise, fields = "ItemCounts,PrimaryImageAspectRatio,BasicSyncInfo,CanDelete,MediaSourceCount", query = {
            ParentId: item.Id,
            Fields: fields
        };
        "BoxSet" !== item.Type && (query.SortBy = "SortName");
        var apiClient = connectionManager.getApiClient(item.ServerId)
          , userId = apiClient.getCurrentUserId();
        "Series" == item.Type ? promise = apiClient.getSeasons(item.Id, {
            userId: userId,
            Fields: fields
        }) : "Season" == item.Type ? (fields += ",Overview",
        promise = apiClient.getEpisodes(item.SeriesId, {
            seasonId: item.Id,
            userId: userId,
            Fields: fields
        })) : "MusicArtist" == item.Type && (query.SortBy = "ProductionYear,SortName"),
        (promise = promise || apiClient.getItems(apiClient.getCurrentUserId(), query)).then((function(result) {
            var html = ""
              , scrollX = !1
              , isList = !1
              , childrenItemsContainer = page.querySelector(".childrenItemsContainer");
            if ("MusicAlbum" == item.Type)
                html = listView.getListViewHtml({
                    items: result.Items,
                    smallIcon: !0,
                    showIndex: !0,
                    index: "disc",
                    showIndexNumberLeft: !0,
                    playFromHere: !0,
                    action: "playallfromhere",
                    image: !1,
                    artist: "auto",
                    containerAlbumArtists: item.AlbumArtists
                }),
                isList = !0;
            else if ("Series" == item.Type)
                scrollX = enableScrollX(),
                html = cardBuilder.getCardsHtml({
                    items: result.Items,
                    shape: "overflowPortrait",
                    showTitle: !0,
                    centerText: !0,
                    lazy: !0,
                    overlayPlayButton: !0,
                    allowBottomPadding: !scrollX
                });
            else if ("Season" == item.Type || "Episode" == item.Type) {
                if ("Episode" !== item.Type && (isList = !0),
                scrollX = "Episode" == item.Type,
                result.Items.length < 2 && "Episode" === item.Type)
                    return;
                "Episode" === item.Type ? html = cardBuilder.getCardsHtml({
                    items: result.Items,
                    shape: "overflowBackdrop",
                    showTitle: !0,
                    displayAsSpecial: "Season" == item.Type && item.IndexNumber,
                    playFromHere: !0,
                    overlayText: !0,
                    lazy: !0,
                    showDetailsMenu: !0,
                    overlayPlayButton: !0,
                    allowBottomPadding: !scrollX,
                    includeParentInfoInTitle: !1
                }) : "Season" === item.Type && (html = listView.getListViewHtml({
                    items: result.Items,
                    showIndexNumber: !1,
                    enableOverview: !0,
                    enablePlayedButton: !layoutManager.mobile,
                    infoButton: !layoutManager.mobile,
                    imageSize: "large",
                    enableSideMediaInfo: !1,
                    highlight: !1,
                    action: layoutManager.desktop ? "none" : "link",
                    imagePlayButton: !0,
                    includeParentInfoInTitle: !1
                }))
            }
            if ("BoxSet" !== item.Type && page.querySelector("#childrenCollapsible").classList.remove("hide"),
            scrollX ? (childrenItemsContainer.classList.add("scrollX"),
            childrenItemsContainer.classList.add("hiddenScrollX"),
            childrenItemsContainer.classList.remove("vertical-wrap"),
            childrenItemsContainer.classList.remove("vertical-list")) : (childrenItemsContainer.classList.remove("scrollX"),
            childrenItemsContainer.classList.remove("hiddenScrollX"),
            childrenItemsContainer.classList.remove("smoothScrollX"),
            isList ? (childrenItemsContainer.classList.add("vertical-list"),
            childrenItemsContainer.classList.remove("vertical-wrap")) : (childrenItemsContainer.classList.add("vertical-wrap"),
            childrenItemsContainer.classList.remove("vertical-list"))),
            layoutManager.mobile && childrenItemsContainer.classList.remove("padded-right"),
            childrenItemsContainer.innerHTML = html,
            imageLoader.lazyChildren(childrenItemsContainer),
            "BoxSet" == item.Type) {
                var collectionItemTypes = [{
                    name: globalize.translate("HeaderVideos"),
                    mediaType: "Video"
                }, {
                    name: globalize.translate("HeaderSeries"),
                    type: "Series"
                }, {
                    name: globalize.translate("HeaderAlbums"),
                    type: "MusicAlbum"
                }, {
                    name: globalize.translate("HeaderBooks"),
                    type: "Book"
                }];
                !function renderCollectionItems(page, parentItem, types, items) {
                    page.querySelector(".collectionItems").classList.remove("hide"),
                    page.querySelector(".collectionItems").innerHTML = "";
                    var _step9, _iterator9 = _createForOfIteratorHelper(types);
                    try {
                        for (_iterator9.s(); !(_step9 = _iterator9.n()).done; ) {
                            var type = _step9.value
                              , typeItems = filterItemsByCollectionItemType(items, type);
                            typeItems.length && renderCollectionItemType(page, parentItem, type, typeItems)
                        }
                    } catch (err) {
                        _iterator9.e(err)
                    } finally {
                        _iterator9.f()
                    }
                    var otherType = {
                        name: globalize.translate("HeaderOtherItems")
                    }
                      , otherTypeItems = items.filter((function(curr) {
                        return !types.filter((function(t) {
                            return filterItemsByCollectionItemType([curr], t).length > 0
                        }
                        )).length
                    }
                    ));
                    otherTypeItems.length && renderCollectionItemType(page, parentItem, otherType, otherTypeItems);
                    items.length || renderCollectionItemType(page, parentItem, {
                        name: globalize.translate("HeaderItems")
                    }, items);
                    var _step10, containers = page.querySelectorAll(".collectionItemsContainer"), notifyRefreshNeeded = function notifyRefreshNeeded() {
                        renderChildren(page, parentItem)
                    }, _iterator10 = _createForOfIteratorHelper(containers);
                    try {
                        for (_iterator10.s(); !(_step10 = _iterator10.n()).done; ) {
                            _step10.value.notifyRefreshNeeded = notifyRefreshNeeded
                        }
                    } catch (err) {
                        _iterator10.e(err)
                    } finally {
                        _iterator10.f()
                    }
                    (function canPlaySomeItemInCollection(items) {
                        for (var i = 0, length = items.length; i < length; i++)
                            if (playbackManager.canPlay(items[i]))
                                return !0;
                        return !1
                    }
                    )(items) || (hideAll(page, "btnPlay", !1),
                    hideAll(page, "btnShuffle", !1));
                    require(["autoFocuser"], (function(autoFocuser) {
                        autoFocuser.autoFocus(page)
                    }
                    ))
                }(page, item, collectionItemTypes, result.Items)
            }
        }
        )),
        "Season" == item.Type ? page.querySelector("#childrenTitle").innerHTML = globalize.translate("HeaderEpisodes") : "Series" == item.Type ? page.querySelector("#childrenTitle").innerHTML = globalize.translate("HeaderSeasons") : "MusicAlbum" == item.Type ? page.querySelector("#childrenTitle").innerHTML = globalize.translate("HeaderTracks") : page.querySelector("#childrenTitle").innerHTML = globalize.translate("HeaderItems"),
        "MusicAlbum" == item.Type || "Season" == item.Type ? (page.querySelector(".childrenSectionHeader").classList.add("hide"),
        page.querySelector("#childrenCollapsible").classList.add("verticalSection-extrabottompadding")) : page.querySelector(".childrenSectionHeader").classList.remove("hide")
    }
    function inferContext(item) {
        return "Movie" === item.Type || "BoxSet" === item.Type ? "movies" : "Series" === item.Type || "Season" === item.Type || "Episode" === item.Type ? "tvshows" : "MusicArtist" === item.Type || "MusicAlbum" === item.Type || "Audio" === item.Type || "AudioBook" === item.Type ? "music" : "Program" === item.Type ? "livetv" : null
    }
    function filterItemsByCollectionItemType(items, typeInfo) {
        return items.filter((function(item) {
            return typeInfo.mediaType ? item.MediaType == typeInfo.mediaType : item.Type == typeInfo.type
        }
        ))
    }
    function renderCollectionItemType(page, parentItem, type, items) {
        var html = "";
        html += '<div class="verticalSection">',
        html += '<div class="sectionTitleContainer sectionTitleContainer-cards padded-left">',
        html += '<h2 class="sectionTitle sectionTitle-cards">',
        html += "<span>" + type.name + "</span>",
        html += "</h2>",
        html += '<button class="btnAddToCollection sectionTitleButton" type="button" is="paper-icon-button-light" style="margin-left:1em;"><span class="material-icons add"></span></button>',
        html += "</div>",
        html += '<div is="emby-itemscontainer" class="itemsContainer collectionItemsContainer vertical-wrap padded-left padded-right">';
        var shape = "MusicAlbum" == type.type ? function getSquareShape(scrollX) {
            return null == scrollX && (scrollX = enableScrollX()),
            scrollX ? "overflowSquare" : "square"
        }(!1) : function getPortraitShape(scrollX) {
            return null == scrollX && (scrollX = enableScrollX()),
            scrollX ? "overflowPortrait" : "portrait"
        }(!1);
        html += cardBuilder.getCardsHtml({
            items: items,
            shape: shape,
            showTitle: !0,
            showYear: "Video" === type.mediaType || "Series" === type.type,
            centerText: !0,
            lazy: !0,
            showDetailsMenu: !0,
            overlayMoreButton: !0,
            showAddToCollection: !1,
            showRemoveFromCollection: !0,
            collectionId: parentItem.Id
        }),
        html += "</div>",
        html += "</div>";
        var collectionItems = page.querySelector(".collectionItems");
        collectionItems.insertAdjacentHTML("beforeend", html),
        imageLoader.lazyChildren(collectionItems),
        collectionItems.querySelector(".btnAddToCollection").addEventListener("click", (function() {
            require(["alert"], (function(alert) {
                alert({
                    text: globalize.translate("AddItemToCollectionHelp"),
                    html: globalize.translate("AddItemToCollectionHelp") + '<br/><br/><a is="emby-linkbutton" class="button-link" target="_blank" href="https://web.archive.org/web/20181216120305/https://github.com/MediaBrowser/Wiki/wiki/Collections">' + globalize.translate("ButtonLearnMore") + "</a>"
                })
            }
            ))
        }
        ))
    }
    function renderScenes(page, item) {
       var images = item.BackdropImageTags || [];
       var test = page.querySelector("#scenesCollapsible");
             if (images)
                for (var i = 0, length = images.length; i < length; i++) {
                    test.innerHTML += '<div is="emby-itemscontainer" class="itemsContainer vertical-wrap padded-left padded-right"><a href="/emby/items/' + item.Id + '/Images/Primary/' + i + '" target="_blank"> <img src="/emby/items/' + item.Id + '/Images/Primary/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="20" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Art/' + i + '" target="_blank"> <img src="/emby/Items/' + item.Id + '/Images/Art/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="20" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Logo/' + i + '" target="_blank"> <img src="/emby/Items/' + item.Id + '/Images/Logo/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="20" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Disc/' + i + '" target="_blank"><img src="/emby/Items/' + item.Id + '/Images/Disc/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="35" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Backdrop/' + i + '" target="_blank"><img src="/emby/Items/' + item.Id + '/Images/Backdrop/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="35" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Banner/' + i + '" target="_blank"><img src="/emby/Items/' + item.Id + '/Images/Banner/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="35" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Box/' + i + '" target="_blank"><img src="/emby/Items/' + item.Id + '/Images/Box/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="35" onerror="this.style.display='+"'none'"+'"/></a><a href="/emby/Items/' + item.Id + '/Images/Thumb/' + i + '" target="_blank"><img src="/emby/Items/' + item.Id + '/Images/Thumb/' + i + '?maxWidth=150' + '&quality=90"' + 'hspace="35" onerror="this.style.display='+"'none'"+'"/></a></div>';
                };
    }
    function getVideosHtml(items, user, limit, moreButtonClass) {
        var html = cardBuilder.getCardsHtml({
            items: items,
            shape: "auto",
            showTitle: !0,
            action: "play",
            overlayText: !1,
            centerText: !0,
            showRuntime: !0
        });
        return limit && items.length > limit && (html += '<p style="margin: 0;padding-left:5px;"><button is="emby-button" type="button" class="raised more ' + moreButtonClass + '">' + globalize.translate("ButtonMore") + "</button></p>"),
        html
    }
    function renderSpecials(page, item, user, limit) {
        connectionManager.getApiClient(item.ServerId).getSpecialFeatures(user.Id, item.Id).then((function(specials) {
            var specialsContent = page.querySelector("#specialsContent");
            specialsContent.innerHTML = getVideosHtml(specials, 0, limit, "moreSpecials"),
            imageLoader.lazyChildren(specialsContent)
        }
        ))
    }
    function renderCast(page, item) {
        var people = (item.People || []).filter((function(p) {
            return "Actor" === p.Type
        }
        ));
        if (people.length) {
            page.querySelector("#castCollapsible").classList.remove("hide");
            var castContent = page.querySelector("#castContent");
            require(["peoplecardbuilder"], (function(peoplecardbuilder) {
                peoplecardbuilder.buildPeopleCards(people, {
                    itemsContainer: castContent,
                    coverImage: !0,
                    serverId: item.ServerId,
                    shape: "overflowPortrait",
                    imageBlurhashes: item.ImageBlurHashes
                })
            }
            ))
        } else
            page.querySelector("#castCollapsible").classList.add("hide")
    }
    function bindAll(view, selector, eventName, fn) {
        var _step11, _iterator11 = _createForOfIteratorHelper(view.querySelectorAll(selector));
        try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done; ) {
                _step11.value.addEventListener(eventName, fn)
            }
        } catch (err) {
            _iterator11.e(err)
        } finally {
            _iterator11.f()
        }
    }
    function onTrackSelectionsSubmit(e) {
        return e.preventDefault(),
        !1
    }
    return window.ItemDetailPage = new function itemDetailPage() {
        this.setInitialCollapsibleState = setInitialCollapsibleState,
        this.renderDetails = renderDetails,
        this.renderCast = renderCast
    }
    ,
    function(view, params) {
        function reload(instance, page, params) {
            loading.show();
            var apiClient = params.serverId ? connectionManager.getApiClient(params.serverId) : ApiClient;
            Promise.all([getPromise(apiClient, params), apiClient.getCurrentUser()]).then((function(_ref) {
                var _ref2 = _slicedToArray(_ref, 2)
                  , item = _ref2[0]
                  , user = _ref2[1];
                currentItem = item,
                reloadFromItem(instance, page, params, item, user)
            }
            )).catch((function(error) {
                console.error("failed to get item or current user: ", error)
            }
            ))
        }
        function playItem(item, startPosition) {
            var playOptions = function getPlayOptions(startPosition) {
                var audioStreamIndex = view.querySelector(".selectAudio").value || null;
                return {
                    startPositionTicks: startPosition,
                    mediaSourceId: view.querySelector(".selectSource").value,
                    audioStreamIndex: audioStreamIndex,
                    subtitleStreamIndex: view.querySelector(".selectSubtitles").value
                }
            }(startPosition);
            playOptions.items = [item],
            playbackManager.play(playOptions)
        }
        function onPlayClick() {
            !function playCurrentItem(button, mode) {
                var item = currentItem;
                if ("Program" !== item.Type)
                    playItem(item, item.UserData && "resume" === mode ? item.UserData.PlaybackPositionTicks : 0);
                else {
                    var apiClient = connectionManager.getApiClient(item.ServerId);
                    apiClient.getLiveTvChannel(item.ChannelId, apiClient.getCurrentUserId()).then((function(channel) {
                        playbackManager.play({
                            items: [channel]
                        })
                    }
                    ))
                }
            }(0, this.getAttribute("data-mode"))
        }
        function onPlayerChange() {
            renderTrackSelections(view, self, currentItem),
            setTrailerButtonVisibility(view, currentItem)
        }
        function onWebSocketMessage(e, data) {
            var msg = data;
            if ("UserDataChanged" === msg.MessageType && currentItem && msg.Data.UserId == apiClient.getCurrentUserId()) {
                var key = currentItem.UserData.Key
                  , userData = msg.Data.UserDataList.filter((function(u) {
                    return u.Key == key
                }
                ))[0];
                userData && (currentItem.UserData = userData,
                reloadPlayButtons(view, currentItem),
                refreshImage(view, currentItem))
            }
        }
        var currentItem, self = this, apiClient = params.serverId ? connectionManager.getApiClient(params.serverId) : ApiClient;
        view.querySelectorAll(".btnPlay"),
        bindAll(view, ".btnPlay", "click", onPlayClick),
        bindAll(view, ".btnResume", "click", onPlayClick),
        bindAll(view, ".btnInstantMix", "click", (function onInstantMixClick() {
            playbackManager.instantMix(currentItem)
        }
        )),
        bindAll(view, ".btnShuffle", "click", (function onShuffleClick() {
            playbackManager.shuffle(currentItem)
        }
        )),
        bindAll(view, ".btnPlayTrailer", "click", (function onPlayTrailerClick() {
            !function playTrailer() {
                playbackManager.playTrailers(currentItem)
            }()
        }
        )),
        bindAll(view, ".btnCancelSeriesTimer", "click", (function onCancelSeriesTimerClick() {
            require(["recordingHelper"], (function(recordingHelper) {
                recordingHelper.cancelSeriesTimerWithConfirmation(currentItem.Id, currentItem.ServerId).then((function() {
                    Dashboard.navigate("livetv.html")
                }
                ))
            }
            ))
        }
        )),
        bindAll(view, ".btnCancelTimer", "click", (function onCancelTimerClick() {
            require(["recordingHelper"], (function(recordingHelper) {
                recordingHelper.cancelTimer(connectionManager.getApiClient(currentItem.ServerId), currentItem.TimerId).then((function() {
                    reload(self, view, params)
                }
                ))
            }
            ))
        }
        )),
        bindAll(view, ".btnDownload", "click", (function onDownloadClick() {
            require(["fileDownloader"], (function(fileDownloader) {
                var downloadHref = apiClient.getItemDownloadUrl(currentItem.Id);
                fileDownloader.download([{
                    url: downloadHref,
                    itemId: currentItem.Id,
                    serverId: currentItem.serverId
                }])
            }
            ))
        }
        )),
        view.querySelector(".trackSelections").addEventListener("submit", onTrackSelectionsSubmit),
        view.querySelector(".btnSplitVersions").addEventListener("click", (function() {
            !function splitVersions(instance, page, apiClient, params) {
                require(["confirm"], (function(confirm) {
                    confirm("Are you sure you wish to split the media sources into separate items?", "Split Media Apart").then((function() {
                        loading.show(),
                        apiClient.ajax({
                            type: "DELETE",
                            url: apiClient.getUrl("Videos/" + params.id + "/AlternateSources")
                        }).then((function() {
                            loading.hide(),
                            reload(instance, page, params)
                        }
                        ))
                    }
                    ))
                }
                ))
            }(self, view, apiClient, params)
        }
        )),
        bindAll(view, ".btnMoreCommands", "click", (function onMoreCommandsClick() {
            var button = this;
            apiClient.getCurrentUser().then((function(user) {
                itemContextMenu.show(getContextMenuOptions(currentItem, user, button)).then((function(result) {
                    result.deleted ? appRouter.goHome() : result.updated && reload(self, view, params)
                }
                ))
            }
            ))
        }
        )),
        view.querySelector(".selectSource").addEventListener("change", (function() {
            renderVideoSelections(view, self._currentPlaybackMediaSources),
            renderAudioSelections(view, self._currentPlaybackMediaSources),
            renderSubtitleSelections(view, self._currentPlaybackMediaSources)
        }
        )),
        view.addEventListener("click", (function(e) {
            dom.parentWithClass(e.target, "moreScenes") ? renderScenes(view, currentItem) : dom.parentWithClass(e.target, "morePeople") ? renderCast(view, currentItem) : dom.parentWithClass(e.target, "moreSpecials") && apiClient.getCurrentUser().then((function(user) {
                renderSpecials(view, currentItem, user)
            }
            ))
        }
        )),
        view.querySelector(".detailImageContainer").addEventListener("click", (function(e) {
            dom.parentWithClass(e.target, "itemDetailGalleryLink") && function editImages() {
                return new Promise((function(resolve, reject) {
                    require(["imageEditor"], (function(imageEditor) {
                        imageEditor.show({
                            itemId: currentItem.Id,
                            serverId: currentItem.ServerId
                        }).then(resolve, reject)
                    }
                    ))
                }
                ))
            }().then((function() {
                reload(self, view, params)
            }
            ))
        }
        )),
        view.addEventListener("viewshow", (function(e) {
            libraryMenu.setTransparentMenu(!0),
            e.detail.isRestored ? currentItem && (Emby.Page.setTitle(""),
            renderTrackSelections(this, self, currentItem, !0)) : reload(self, this, params),
            events.on(apiClient, "message", onWebSocketMessage),
            events.on(playbackManager, "playerchange", onPlayerChange)
        }
        )),
        view.addEventListener("viewbeforehide", (function() {
            events.off(apiClient, "message", onWebSocketMessage),
            events.off(playbackManager, "playerchange", onPlayerChange),
            libraryMenu.setTransparentMenu(!1)
        }
        )),
        view.addEventListener("viewdestroy", (function() {
            currentItem = null,
            self._currentPlaybackMediaSources = null,
            self.currentRecordingFields = null
        }
        ))
    }
}
));
