var finesse = finesse || {};

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.iframe = (function ($) {
    var user, media, utils, url,
        height = 800,
        width = 'max',
        states = finesse.restservices.Media.States,
        clientLogs = finesse.cslogger.ClientLogger,
        prefs = new gadgets.Prefs(),

    /**
     * Populates the fields in the gadget with data.
     */
    render = function () {
        // if (!media) {
        //     return;
        // }
        // var readyButton = $("#goReady");
        // var notReadyButton = $("#goNotReady");
        // var stateIcon = $("#state-icon-status");
        //
        // $("#sign-in").hide();
        // $("#state-area").show();
        // $("#sign-out").show();
        // $("#mediaSummary").show();

        // set iframe url and height using URL parameters (or use default height value if its not set)
        $("#myiframe").attr('src', url).attr('height', height);
        if (width !== 'max' && width > 0) { // is width a number?
          // set width of the iframe using iframe html attribute 'width'
          $("#myiframe").attr('width', width);
        } else {
          // use css 100% width value
          $("#myiframe").css('width', '100%');
        }
        adjustGadgetHeight();
    },

    /**
     * Adjusts the height of the gadget to account for the tab pane which contains dialogs.
     */
    adjustGadgetHeight = function() {
        setTimeout(function() {
            // var bScrollHeight = $("body").height();
            // var height = bScrollHeight + 20;
            // if(height < 125) {
            //     height = 125;
            // }
            gadgets.window.adjustHeight(height);
        },100);
    },

    /**
     * Handler for the onLoad of a User object.  This occurs when the User object is initially read
     * from the Finesse server.  Any once only initialization should be done within this function.
     */
    handleUserLoad = function (_user) {
        // mediaList = user.getMediaList( {
        //     onLoad: handleMediaListLoad
        // });
    },

    /**
     * Utility function that returns an array of key-value pairs
     * for the query parameters in a given URL.
     */
    getUrlVars = function(url) {
        var vars = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
                vars[key] = value;
            });
        return vars;
    },

    /**
     * Validates that the gadget is configured with the correct query params from the desktop layout.
     * MRD ID is required for the gadget to work. For the MRD name and max dialogs we default to 'Media'
     * and 5 dialogs respectively if they are not configured or misconfigured.
     */
    checkGadgetQueryParams = function() {
        //First get just the URI for this gadget out of the full finesse URI and decode it.
        var gadgetURI = decodeURIComponent(getUrlVars(location.search)["url"]);

        //Now get the individual query params from the gadget URI
        var decodedGadgetURI = getUrlVars(gadgetURI);
        url = decodedGadgetURI["url"];
        height = decodedGadgetURI["height"] || height;
        width = decodedGadgetURI["width"] || width;
        clientLogs.log("parameter for iframe URL = " + url);
        adjustGadgetHeight();
        // mrdName = decodedGadgetURI["mrdname"];
        // maxDialogs = decodedGadgetURI["maxdialogs"];
        // interruptAction = decodedGadgetURI["interruptAction"];
        // dialogLogoutAction = decodedGadgetURI["dialogLogoutAction"];

        //If no MRD ID is configured or it's not a number we want to throw an error during init.
        // if (!mrdID || isNaN(mrdID)) {
        //     return false;
        // }

        //If there's no max dialogs configured or the value is not a number then default it to 5.
        // if (!maxDialogs || isNaN(maxDialogs)) {
        //     maxDialogs = "5";
        // }

        //If there's no interruptAction configured or the value is not valid, default to "ACCEPT".
        // if (!finesse.restservices.InterruptActions.isValidAction(interruptAction)) {
        //     interruptAction = finesse.restservices.InterruptActions.ACCEPT;
        // }

        //If there's no dialogLogoutAction configured or the value is not valid, default to "CLOSE".
        // if (!finesse.restservices.DialogLogoutActions.isValidAction(dialogLogoutAction)) {
        //     dialogLogoutAction = finesse.restservices.DialogLogoutActions.CLOSE;
        // }

        //If there's no dialogLogoutAction configured or the value is not valid, default to "CLOSE".
        // if (!dialogLogoutAction || dialogLogoutAction.toUpperCase()!=="CLOSE" && dialogLogoutAction.toUpperCase()!=="TRANSFER") {
        //     dialogLogoutAction = "CLOSE";
        // }

        return true;
    };

    /** @scope finesse.modules.TaskManagementGadget */
    return {
        /**
         * Performs all initialization for this gadget
         */
        init : function () {
            var config = finesse.gadget.Config;

            gadgets.window.setTitle(prefs.getMsg('gadget.iframe.message.title'));

            clientLogs = finesse.cslogger.ClientLogger;   // declare clientLogs

            /** Initialize private references */
            utils = finesse.utilities.Utilities;
            msgs = finesse.utilities.I18n.getString;
            uiMsg = finesse.utilities.MessageDisplay;

            adjustGadgetHeight();

            checkGadgetQueryParams();

            // if (!checkGadgetQueryParams()) {
            //     var err = prefs.getMsg("gadget.iframe.message.missingMrdIdParam");
            //     showError(err);
            //     $("#sign-in").hide();
            //     $("#state-area").show();
            //     $("#sign-out").show();
            //     $("#mediaSummary").hide();
            //     gadgets.loadingindicator.dismiss();
            //     return;
            // }

            // mediaOptions = {
            //     maxDialogLimit: maxDialogs,
            //     interruptAction: interruptAction.toUpperCase(),
            //     dialogLogoutAction: dialogLogoutAction.toUpperCase()
            // };

            //initialize bootstrap tooltips
            // $('[data-toggle="tooltip"]').tooltip();

            // Initiate the ClientServices and load the user object.  ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(config);

            // Hookup connect and disconnect handlers so that buttons can be disabled while failing over.
            //
            finesse.clientservices.ClientServices.registerOnConnectHandler(function() {
                render();
            });
            finesse.clientservices.ClientServices.registerOnDisconnectHandler(function() {
                render();
            });

            clientLogs.init(gadgets.Hub, "iframeGadget"); //this gadget id will be logged as a part of the message
            user = new finesse.restservices.User({
                id: config.id,
                onLoad : handleUserLoad
            });

            // Initiate the ContainerServices and add a handler for when the tab is visible
            // to adjust the height of this gadget in case the tab was not visible
            // when the html was rendered (adjustHeight only works when tab is visible)

            containerServices = finesse.containerservices.ContainerServices.init();
            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, function(){
                clientLogs.log("iframeGadget is now visible");  // log to Finesse logger
            });
            containerServices.makeActiveTabReq();

            //now that the gadget has loaded, remove the loading indicator
            gadgets.loadingindicator.dismiss();
        }
    };
}(jQuery));
