function createPL(v3d = window.v3d) {
  // global variables used in the init tab
  const _initGlob = {
    percentage: 0,
    output: {
      initOptions: {
        fadeAnnotations: true,
        useBkgTransp: false,
        preserveDrawBuf: false,
        useCompAssets: false,
        useFullscreen: true,
        useCustomPreloader: false,
        preloaderStartCb: function () {},
        preloaderProgressCb: function () {},
        preloaderEndCb: function () {},
      },
    },
  };

  // global variables/constants used by puzzles' functions
  var _pGlob = {};

  _pGlob.objCache = {};
  _pGlob.fadeAnnotations = true;
  _pGlob.pickedObject = "";
  _pGlob.hoveredObject = "";
  _pGlob.mediaElements = {};
  _pGlob.loadedFile = "";
  _pGlob.states = [];
  _pGlob.percentage = 0;
  _pGlob.openedFile = "";
  _pGlob.openedFileMeta = {};
  _pGlob.xrSessionAcquired = false;
  _pGlob.xrSessionCallbacks = [];
  _pGlob.screenCoords = new v3d.Vector2();
  _pGlob.intervalTimers = {};
  _pGlob.customEvents = new v3d.EventDispatcher();
  _pGlob.eventListeners = [];
  _pGlob.htmlElements = new Set();

  _pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
  _pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
  _pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
  _pGlob.MIN_DRAG_SCALE = 10e-4;
  _pGlob.SET_OBJ_ROT_EPS = 1e-8;

  _pGlob.vec2Tmp = new v3d.Vector2();
  _pGlob.vec2Tmp2 = new v3d.Vector2();
  _pGlob.vec3Tmp = new v3d.Vector3();
  _pGlob.vec3Tmp2 = new v3d.Vector3();
  _pGlob.vec3Tmp3 = new v3d.Vector3();
  _pGlob.vec3Tmp4 = new v3d.Vector3();
  _pGlob.eulerTmp = new v3d.Euler();
  _pGlob.eulerTmp2 = new v3d.Euler();
  _pGlob.quatTmp = new v3d.Quaternion();
  _pGlob.quatTmp2 = new v3d.Quaternion();
  _pGlob.colorTmp = new v3d.Color();
  _pGlob.mat4Tmp = new v3d.Matrix4();
  _pGlob.planeTmp = new v3d.Plane();
  _pGlob.raycasterTmp = new v3d.Raycaster(); // always check visibility

  const createPzLib = ({ v3d = null, appInstance = null }) => {
    function getMaterialEditableColors(matName) {
      const mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
      if (!mat) {
        return [];
      }

      if (mat.isMeshNodeMaterial) {
        return Object.keys(mat.nodeRGBMap);
      } else if (mat.isMeshStandardMaterial) {
        return ["color", "emissive"];
      } else {
        return [];
      }
    }

    function areListenersSame(
      target0,
      type0,
      listener0,
      optionsOrUseCapture0,
      target1,
      type1,
      listener1,
      optionsOrUseCapture1
    ) {
      const capture0 = Boolean(
        optionsOrUseCapture0 instanceof Object
          ? optionsOrUseCapture0.capture
          : optionsOrUseCapture0
      );
      const capture1 = Boolean(
        optionsOrUseCapture1 instanceof Object
          ? optionsOrUseCapture1.capture
          : optionsOrUseCapture1
      );
      return (
        target0 === target1 &&
        type0 === type1 &&
        listener0 === listener1 &&
        capture0 === capture1
      );
    }

    function bindListener(target, type, listener, optionsOrUseCapture) {
      const alreadyExists = _pGlob.eventListeners.some((elem) => {
        return areListenersSame(
          elem.target,
          elem.type,
          elem.listener,
          elem.optionsOrUseCapture,
          target,
          type,
          listener,
          optionsOrUseCapture
        );
      });

      if (!alreadyExists) {
        target.addEventListener(type, listener, optionsOrUseCapture);
        _pGlob.eventListeners.push({
          target,
          type,
          listener,
          optionsOrUseCapture,
        });
      }
    }

    function getElement(id, isParent = false) {
      let elem;
      if (Array.isArray(id) && id[0] === "CONTAINER") {
        if (appInstance !== null) {
          elem = appInstance.container;
        } else if (typeof _initGlob !== "undefined") {
          // if we are on the initialization stage, we still can have access
          // to the container element
          const contId = _initGlob.container;
          elem = isParent
            ? document.getElementById(contId)
            : document.getElementById(contId);
        }
      } else if (Array.isArray(id) && id[0] === "WINDOW") {
        elem = window;
      } else if (Array.isArray(id) && id[0] === "DOCUMENT") {
        elem = document;
      } else if (Array.isArray(id) && id[0] === "BODY") {
        elem = document.body;
      } else if (Array.isArray(id) && id[0] === "QUERYSELECTOR") {
        elem = isParent
          ? document.querySelector(id)
          : document.querySelector(id);
      } else {
        elem = isParent
          ? document.getElementById(id)
          : document.getElementById(id);
      }
      return elem;
    }

    function getElements(ids, isParent = false) {
      const elems = [];
      if (
        Array.isArray(ids) &&
        ids[0] !== "CONTAINER" &&
        ids[0] !== "WINDOW" &&
        ids[0] !== "DOCUMENT" &&
        ids[0] !== "BODY" &&
        ids[0] !== "QUERYSELECTOR"
      ) {
        for (let i = 0; i < ids.length; i++) {
          elems.push(getElement(ids[i], isParent));
        }
      } else {
        elems.push(getElement(ids, isParent));
      }
      return elems;
    }

    return {
      getMaterialEditableColors,
      bindListener,
      getElements,
    };
  };

  var PL = {};
  // backward compatibility
  if (v3d[Symbol.toStringTag] !== "Module") {
    v3d.PL = v3d.puzzles = PL;
  }

  PL.procedures = PL.procedures || {};

  PL.execInitPuzzles = function (options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    const PzLib = createPzLib({ v3d });

    // provide the container's id to puzzles that need access to the container
    _initGlob.container =
      options !== undefined && "container" in options ? options.container : "";

    return _initGlob.output;
  };

  PL.init = function (appInstance, initOptions) {
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = appInstance;

    const PzLib = createPzLib({ v3d, appInstance });

    initOptions = initOptions || {};

    if ("fadeAnnotations" in initOptions) {
      _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
    }

    // setMaterialColor puzzle
    function setMaterialColor(matName, colName, r, g, b, cssCode) {
      var colors = PzLib.getMaterialEditableColors(matName);

      if (colors.indexOf(colName) < 0) return;

      if (cssCode) {
        var color = new v3d.Color(cssCode);
        r = color.r;
        g = color.g;
        b = color.b;
      }

      var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

      for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
          var rgbIdx = mat.nodeRGBMap[colName];
          mat.nodeRGB[rgbIdx].x = r;
          mat.nodeRGB[rgbIdx].y = g;
          mat.nodeRGB[rgbIdx].z = b;
        } else {
          mat[colName].r = r;
          mat[colName].g = g;
          mat[colName].b = b;
        }
        mat.needsUpdate = true;

        if (appInstance.scene !== null) {
          if (mat === appInstance.scene.worldMaterial) {
            appInstance.updateEnvironment(mat);
          }
        }
      }
    }

    // eventHTMLElem puzzle
    function eventHTMLElem(eventType, ids, isParent, callback) {
      var elems = PzLib.getElements(ids, isParent);
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem) continue;

        PzLib.bindListener(elem, eventType, callback);
      }
    }
    setMaterialColor("carpaint", "Color_1", 0, 0, 0, "");
    setMaterialColor("carpaint", "Color_2", 0, 0, 0, "");
    eventHTMLElem("click", "Black", false, function (event) {
      setMaterialColor("carpaint", "Color_1", 0, 0, 0, "");
      setMaterialColor("carpaint", "Color_2", 0, 0, 0, "");
    });

    eventHTMLElem("click", "BluePurple", false, function (event) {
      setMaterialColor("carpaint", "Color_1", 0.167263, 0, 0.881073, "");
      setMaterialColor("carpaint", "Color_2", 0.014415, 0, 1, "");
    });

    eventHTMLElem("click", "RedGold", false, function (event) {
      setMaterialColor("carpaint", "Color_1", 1, 0.362139, 0, "");
      setMaterialColor("carpaint", "Color_2", 1, 0, 0, "");
    });

    eventHTMLElem("click", "Red", false, function (event) {
      setMaterialColor("carpaint", "Color_1", 1, 0, 0, "");
      setMaterialColor("carpaint", "Color_2", 1, 0, 0, "");
    });
  }; // end of PL.init function

  PL.disposeListeners = function () {
    if (_pGlob) {
      _pGlob.eventListeners.forEach(
        ({ target, type, listener, optionsOrUseCapture }) => {
          target.removeEventListener(type, listener, optionsOrUseCapture);
        }
      );
      _pGlob.eventListeners.length = 0;
    }
  };

  PL.disposeHTMLElements = function () {
    if (_pGlob) {
      _pGlob.htmlElements.forEach((elem) => {
        elem.remove();
      });
      _pGlob.htmlElements.clear();
    }
  };

  PL.dispose = function () {
    PL.disposeListeners();
    PL.disposeHTMLElements();
    _pGlob = null;
    // backward compatibility
    if (v3d[Symbol.toStringTag] !== "Module") {
      delete v3d.PL;
      delete v3d.puzzles;
    }
  };

  return PL;
}

export { createPL };
