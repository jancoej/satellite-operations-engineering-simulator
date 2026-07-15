```javascript
// =====================================================
// SATELLITE OPERATIONS & CAPACITY ENGINEERING SIMULATOR
// VERSION 1 - MISSION CONTROL
//
// FEATURES
// - 3D Earth with CesiumJS
// - LEO, MEO and GEO satellites
// - Dynamic satellite movement
// - Real-time synthetic telemetry
// - Satellite health monitoring
// - Payload performance monitoring
// - Mission status evaluation
// - Operational event log
// =====================================================


// =====================================================
// 1. CREATE CESIUM VIEWER
// =====================================================

const viewer = new Cesium.Viewer("cesiumContainer", {

  animation: false,

  timeline: false,

  geocoder: false,

  homeButton: true,

  sceneModePicker: false,

  navigationHelpButton: false,

  fullscreenButton: true,

  baseLayerPicker: true

});


// =====================================================
// 2. SPACE AND EARTH
// =====================================================

viewer.scene.backgroundColor =
  Cesium.Color.BLACK;


viewer.scene.globe.enableLighting =
  true;


// =====================================================
// 3. ORBIT ALTITUDES
// =====================================================

// Altitudes in meters

const LEO_ALTITUDE =
  2000000;      // 2,000 km


const MEO_ALTITUDE =
  10000000;     // 10,000 km


const GEO_ALTITUDE =
  35786000;     // 35,786 km


// =====================================================
// 4. CREATE ORBIT FUNCTION
// =====================================================

function createOrbit(
  name,
  altitude,
  color,
  width = 4
) {

  const positions = [];


  for (
    let longitude = -180;
    longitude <= 180;
    longitude += 1
  ) {

    positions.push(

      Cesium.Cartesian3.fromDegrees(
        longitude,
        0,
        altitude
      )

    );

  }


  return viewer.entities.add({

    name: name,


    polyline: {

      positions: positions,

      width: width,

      material: color,

      arcType:
        Cesium.ArcType.NONE

    }

  });

}


// =====================================================
// 5. CREATE THREE ORBITS
// =====================================================


// LEO

const leoOrbit = createOrbit(

  "LEO Orbit",

  LEO_ALTITUDE,

  Cesium.Color.CYAN,

  5

);


// MEO

const meoOrbit = createOrbit(

  "MEO Orbit",

  MEO_ALTITUDE,

  Cesium.Color.ORANGE,

  5

);


// GEO

const geoOrbit = createOrbit(

  "GEO Orbit",

  GEO_ALTITUDE,

  Cesium.Color.LIME,

  5

);


// =====================================================
// 6. SATELLITE POSITIONS
// =====================================================


// LEO satellite

let leoLongitude =
  -30;


// MEO satellite

let meoLongitude =
  80;


// GEO satellite

const geoLongitude =
  20;


// =====================================================
// 7. SATELLITE SPEEDS
// =====================================================


// LEO moves fastest

const LEO_SPEED =
  0.05;


// MEO moves slower

const MEO_SPEED =
  0.015;


// GEO remains fixed relative to Earth


// =====================================================
// 8. DYNAMIC LEO POSITION
// =====================================================

const leoPosition =

  new Cesium.CallbackPositionProperty(

    function () {

      return Cesium.Cartesian3.fromDegrees(

        leoLongitude,

        0,

        LEO_ALTITUDE

      );

    },

    false

  );


// =====================================================
// 9. DYNAMIC MEO POSITION
// =====================================================

const meoPosition =

  new Cesium.CallbackPositionProperty(

    function () {

      return Cesium.Cartesian3.fromDegrees(

        meoLongitude,

        0,

        MEO_ALTITUDE

      );

    },

    false

  );


// =====================================================
// 10. CREATE SATELLITE FUNCTION
// =====================================================

function createSatellite(
  name,
  position,
  labelColor
) {

  return viewer.entities.add({

    name: name,

    position: position,


    billboard: {

      image:
        "satellite.png",

      width:
        45,

      height:
        45,

      verticalOrigin:
        Cesium.VerticalOrigin.CENTER,

      horizontalOrigin:
        Cesium.HorizontalOrigin.CENTER,

      disableDepthTestDistance:
        Number.POSITIVE_INFINITY

    },


    label: {

      text:
        name,

      font:
        "bold 17px Arial",

      fillColor:
        labelColor,

      outlineColor:
        Cesium.Color.BLACK,

      outlineWidth:
        3,

      style:
        Cesium.LabelStyle.FILL_AND_OUTLINE,

      showBackground:
        true,

      backgroundColor:
        Cesium.Color.BLACK.withAlpha(0.8),

      pixelOffset:
        new Cesium.Cartesian2(
          0,
          -45
        ),

      horizontalOrigin:
        Cesium.HorizontalOrigin.CENTER,

      verticalOrigin:
        Cesium.VerticalOrigin.BOTTOM,

      disableDepthTestDistance:
        Number.POSITIVE_INFINITY

    }

  });

}


// =====================================================
// 11. CREATE LEO SATELLITE
// =====================================================

const leoSatellite = createSatellite(

  "LEO SATELLITE",

  leoPosition,

  Cesium.Color.CYAN

);


// =====================================================
// 12. CREATE MEO SATELLITE
// =====================================================

const meoSatellite = createSatellite(

  "MEO SATELLITE",

  meoPosition,

  Cesium.Color.ORANGE

);


// =====================================================
// 13. CREATE GEO SATELLITE
// =====================================================

const geoPosition =

  Cesium.Cartesian3.fromDegrees(

    geoLongitude,

    0,

    GEO_ALTITUDE

  );


const geoSatellite = createSatellite(

  "GEO SATELLITE",

  geoPosition,

  Cesium.Color.LIME

);


// =====================================================
// 14. SATELLITE ANIMATION
// =====================================================

let previousTime =
  performance.now();


function animateSatellites(
  currentTime
) {

  const deltaTime =

    currentTime -
    previousTime;


  previousTime =
    currentTime;


  // -------------------------
  // Move LEO
  // -------------------------

  leoLongitude +=

    LEO_SPEED *
    deltaTime;


  // -------------------------
  // Move MEO
  // -------------------------

  meoLongitude +=

    MEO_SPEED *
    deltaTime;


  // -------------------------
  // Longitude reset
  // -------------------------

  if (
    leoLongitude > 180
  ) {

    leoLongitude =
      -180;

  }


  if (
    meoLongitude > 180
  ) {

    meoLongitude =
      -180;

  }


  requestAnimationFrame(
    animateSatellites
  );

}


// Start satellite animation

requestAnimationFrame(
  animateSatellites
);


// =====================================================
// 15. INITIAL CAMERA VIEW
// =====================================================

viewer.flyTo(

  [

    leoOrbit,

    meoOrbit,

    geoOrbit

  ],

  {

    duration:
      3

  }

);


// =====================================================
// 16. ORBIT NAVIGATION BUTTONS
// =====================================================

const orbitButtons =

  document.querySelectorAll(
    ".orbit-button"
  );


// -----------------------------------------------------
// ACTIVE BUTTON FUNCTION
// -----------------------------------------------------

function setActiveOrbitButton(
  activeButton
) {

  orbitButtons.forEach(

    function (button) {

      button.classList.remove(
        "active"
      );

    }

  );


  activeButton.classList.add(
    "active"
  );

}


// -----------------------------------------------------
// ALL ORBITS
// -----------------------------------------------------

document
  .getElementById("btnAll")
  .addEventListener(
    "click",
    function () {

      setActiveOrbitButton(
        this
      );


      viewer.flyTo(

        [

          leoOrbit,

          meoOrbit,

          geoOrbit

        ],

        {

          duration:
            2

        }

      );

    }
  );


// -----------------------------------------------------
// LEO VIEW
// -----------------------------------------------------

document
  .getElementById("btnLeo")
  .addEventListener(
    "click",
    function () {

      setActiveOrbitButton(
        this
      );


      viewer.camera.flyTo({

        destination:

          Cesium.Cartesian3.fromDegrees(

            leoLongitude,

            15,

            22000000

          ),

        duration:
          2

      });

    }
  );


// -----------------------------------------------------
// MEO VIEW
// -----------------------------------------------------

document
  .getElementById("btnMeo")
  .addEventListener(
    "click",
    function () {

      setActiveOrbitButton(
        this
      );


      viewer.camera.flyTo({

        destination:

          Cesium.Cartesian3.fromDegrees(

            meoLongitude,

            20,

            40000000

          ),

        duration:
          2

      });

    }
  );


// -----------------------------------------------------
// GEO VIEW
// -----------------------------------------------------

document
  .getElementById("btnGeo")
  .addEventListener(
    "click",
    function () {

      setActiveOrbitButton(
        this
      );


      viewer.camera.flyTo({

        destination:

          Cesium.Cartesian3.fromDegrees(

            geoLongitude,

            20,

            90000000

          ),

        duration:
          2

      });

    }
  );


// =====================================================
// 17. MISSION CLOCK
// =====================================================

const simulationStartTime =
  Date.now();


function updateMissionClock() {

  const elapsedMilliseconds =

    Date.now() -
    simulationStartTime;


  const elapsedSeconds =

    Math.floor(

      elapsedMilliseconds /
      1000

    );


  const hours =

    Math.floor(

      elapsedSeconds /
      3600

    );


  const minutes =

    Math.floor(

      (
        elapsedSeconds %
        3600
      ) /
      60

    );


  const seconds =

    elapsedSeconds %
    60;


  const formattedTime =

    String(hours)
      .padStart(
        2,
        "0"
      )

    +

    ":"

    +

    String(minutes)
      .padStart(
        2,
        "0"
      )

    +

    ":"

    +

    String(seconds)
      .padStart(
        2,
        "0"
      );


  document
    .getElementById(
      "missionClock"
    )
    .textContent =
      formattedTime;

}


// Update mission clock every second

setInterval(

  updateMissionClock,

  1000

);


// =====================================================
// 18. TELEMETRY MODEL
// =====================================================

const telemetry = {

  battery:
    87.0,

  voltage:
    48.2,

  temperature:
    41.3,

  attitudeError:
    0.03,

  throughput:
    8.7,

  capacity:
    72.5,

  linkMargin:
    5.4,

  activeUsers:
    12460

};


// =====================================================
// 19. RANDOM VARIATION FUNCTION
// =====================================================

function randomVariation(
  min,
  max
) {

  return (

    Math.random() *

    (
      max -
      min
    )

    +

    min

  );

}


// =====================================================
// 20. LIMIT VALUE FUNCTION
// =====================================================

function clamp(
  value,
  min,
  max
) {

  return Math.min(

    Math.max(

      value,

      min

    ),

    max

  );

}


// =====================================================
// 21. UPDATE TELEMETRY VALUES
// =====================================================

function updateTelemetry() {


  // ---------------------------------------------------
  // SPACECRAFT TELEMETRY
  // ---------------------------------------------------


  telemetry.battery +=

    randomVariation(
      -0.12,
      0.08
    );


  telemetry.battery =

    clamp(

      telemetry.battery,

      65,

      100

    );



  telemetry.voltage +=

    randomVariation(
      -0.08,
      0.08
    );


  telemetry.voltage =

    clamp(

      telemetry.voltage,

      46,

      50

    );



  telemetry.temperature +=

    randomVariation(
      -0.25,
      0.25
    );


  telemetry.temperature =

    clamp(

      telemetry.temperature,

      35,

      60

    );



  telemetry.attitudeError +=

    randomVariation(
      -0.005,
      0.005
    );


  telemetry.attitudeError =

    clamp(

      telemetry.attitudeError,

      0.01,

      0.20

    );



  // ---------------------------------------------------
  // PAYLOAD TELEMETRY
  // ---------------------------------------------------


  telemetry.throughput +=

    randomVariation(
      -0.18,
      0.18
    );


  telemetry.throughput =

    clamp(

      telemetry.throughput,

      4,

      12

    );



  telemetry.capacity =

    (
      telemetry.throughput /
      12
    )

    *

    100;



  telemetry.linkMargin +=

    randomVariation(
      -0.12,
      0.12
    );


  telemetry.linkMargin =

    clamp(

      telemetry.linkMargin,

      1.5,

      8

    );



  telemetry.activeUsers +=

    Math.round(

      randomVariation(
        -90,
        110
      )

    );


  telemetry.activeUsers =

    clamp(

      telemetry.activeUsers,

      8000,

      20000

    );



  // ---------------------------------------------------
  // UPDATE USER INTERFACE
  // ---------------------------------------------------

  updateTelemetryDisplay();


  // ---------------------------------------------------
  // CHECK SATELLITE HEALTH
  // ---------------------------------------------------

  evaluateMissionStatus();

}


// =====================================================
// 22. UPDATE TELEMETRY DISPLAY
// =====================================================

function updateTelemetryDisplay() {


  // Battery

  document
    .getElementById(
      "batteryValue"
    )
    .textContent =

      telemetry.battery
        .toFixed(1)

      +

      " %";


  document
    .getElementById(
      "batteryBar"
    )
    .style.width =

      telemetry.battery

      +

      "%";



  // Voltage

  document
    .getElementById(
      "voltageValue"
    )
    .textContent =

      telemetry.voltage
        .toFixed(1)

      +

      " V";



  // Temperature

  document
    .getElementById(
      "temperatureValue"
    )
    .textContent =

      telemetry.temperature
        .toFixed(1)

      +

      " °C";



  // Attitude Error

  document
    .getElementById(
      "attitudeValue"
    )
    .textContent =

      telemetry.attitudeError
        .toFixed(3)

      +

      "°";



  // Throughput

  document
    .getElementById(
      "throughputValue"
    )
    .textContent =

      telemetry.throughput
        .toFixed(1)

      +

      " Gbps";



  // Capacity

  document
    .getElementById(
      "capacityValue"
    )
    .textContent =

      telemetry.capacity
        .toFixed(1)

      +

      " %";


  document
    .getElementById(
      "capacityBar"
    )
    .style.width =

      telemetry.capacity

      +

      "%";



  // Link Margin

  document
    .getElementById(
      "linkMarginValue"
    )
    .textContent =

      telemetry.linkMargin
        .toFixed(1)

      +

      " dB";



  // Active Users

  document
    .getElementById(
      "activeUsersValue"
    )
    .textContent =

      Math.round(
        telemetry.activeUsers
      )
      .toLocaleString();

}


// =====================================================
// 23. MISSION STATUS EVALUATION
// =====================================================
//
// SIMPLIFIED OPERATIONAL THRESHOLDS:
//
// BATTERY
// Warning:  < 75 %
// Critical: < 68 %
//
// TEMPERATURE
// Warning:  > 50 °C
// Critical: > 55 °C
//
// CAPACITY
// Warning:  > 85 %
// Critical: > 95 %
//
// LINK MARGIN
// Warning:  < 3 dB
// Critical: < 2 dB
//
// ATTITUDE ERROR
// Warning:  > 0.10°
// Critical: > 0.15°
//
// These thresholds are simulation parameters.
// =====================================================

let previousMissionStatus =
  "NOMINAL";


function evaluateMissionStatus() {

  let missionStatus =
    "NOMINAL";


  // ---------------------------------------------------
  // CRITICAL CONDITIONS
  // ---------------------------------------------------

  if (

    telemetry.battery <
      68

    ||

    telemetry.temperature >
      55

    ||

    telemetry.capacity >
      95

    ||

    telemetry.linkMargin <
      2

    ||

    telemetry.attitudeError >
      0.15

  ) {

    missionStatus =
      "CRITICAL";

  }


  // ---------------------------------------------------
  // WARNING CONDITIONS
  // ---------------------------------------------------

  else if (

    telemetry.battery <
      75

    ||

    telemetry.temperature >
      50

    ||

    telemetry.capacity >
      85

    ||

    telemetry.linkMargin <
      3

    ||

    telemetry.attitudeError >
      0.10

  ) {

    missionStatus =
      "WARNING";

  }


  updateMissionStatusDisplay(
    missionStatus
  );


  // Log only when the mission status changes

  if (
    missionStatus !==
    previousMissionStatus
  ) {

    if (
      missionStatus ===
      "NOMINAL"
    ) {

      addEvent(

        "INFO",

        "Satellite health returned to nominal operational conditions."

      );

    }


    else if (
      missionStatus ===
      "WARNING"
    ) {

      addEvent(

        "WARNING",

        "Satellite telemetry exceeded a simulated operational warning threshold."

      );

    }


    else if (
      missionStatus ===
      "CRITICAL"
    ) {

      addEvent(

        "CRITICAL",

        "Critical satellite condition detected. Operator attention required."

      );

    }


    previousMissionStatus =
      missionStatus;

  }

}


// =====================================================
// 24. UPDATE MISSION STATUS DISPLAY
// =====================================================

function updateMissionStatusDisplay(
  status
) {

  const statusText =

    document
      .getElementById(
        "missionStatus"
      );


  const statusIndicator =

    document
      .getElementById(
        "missionStatusIndicator"
      );


  statusText.textContent =
    status;


  statusIndicator.classList.remove(

    "nominal",

    "warning",

    "critical"

  );


  statusText.classList.remove(

    "nominal-text",

    "warning-text",

    "critical-text"

  );


  if (
    status ===
    "NOMINAL"
  ) {

    statusIndicator
      .classList
      .add(
        "nominal"
      );


    statusText
      .classList
      .add(
        "nominal-text"
      );

  }


  else if (
    status ===
    "WARNING"
  ) {

    statusIndicator
      .classList
      .add(
        "warning"
      );


    statusText
      .classList
      .add(
        "warning-text"
      );

  }


  else if (
    status ===
    "CRITICAL"
  ) {

    statusIndicator
      .classList
      .add(
        "critical"
      );


    statusText
      .classList
      .add(
        "critical-text"
      );

  }

}


// =====================================================
// 25. EVENT LOG
// =====================================================

function addEvent(
  type,
  message
) {

  const eventLog =

    document
      .getElementById(
        "eventLog"
      );


  const now =
    new Date();


  const timeString =

    now
      .toLocaleTimeString(
        "en-GB",
        {

          hour12:
            false

        }
      );


  const eventItem =

    document.createElement(
      "div"
    );


  eventItem.className =
    "event-item";


  const eventTime =

    document.createElement(
      "span"
    );


  eventTime.className =
    "event-time";


  eventTime.textContent =
    timeString;



  const eventType =

    document.createElement(
      "span"
    );


  eventType.className =

    "event-type "

    +

    type.toLowerCase();


  eventType.textContent =
    type;



  const eventMessage =

    document.createElement(
      "span"
    );


  eventMessage.textContent =
    message;



  eventItem.appendChild(
    eventTime
  );


  eventItem.appendChild(
    eventType
  );


  eventItem.appendChild(
    eventMessage
  );


  eventLog.prepend(
    eventItem
  );


  // Keep only the latest 8 events

  while (
    eventLog.children.length >
    8
  ) {

    eventLog.removeChild(

      eventLog.lastChild

    );

  }

}


// =====================================================
// 26. PERIODIC OPERATIONAL EVENTS
// =====================================================

const operationalMessages = [

  "Telemetry packet received from spacecraft.",

  "Satellite health parameters verified.",

  "Payload performance data updated.",

  "Orbit propagation status updated.",

  "Capacity utilization assessment completed.",

  "Spacecraft subsystem monitoring cycle completed."

];


function generateOperationalEvent() {

  const randomIndex =

    Math.floor(

      Math.random() *

      operationalMessages.length

    );


  addEvent(

    "INFO",

    operationalMessages[
      randomIndex
    ]

  );

}


// =====================================================
// 27. START TELEMETRY SIMULATION
// =====================================================


// Update telemetry every 2 seconds

setInterval(

  updateTelemetry,

  2000

);


// Add operational event every 8 seconds

setInterval(

  generateOperationalEvent,

  8000

);


// =====================================================
// 28. INITIALIZE DASHBOARD
// =====================================================

updateMissionClock();


updateTelemetryDisplay();


evaluateMissionStatus();


addEvent(

  "INFO",

  "Mission control dashboard initialized."

);


addEvent(

  "INFO",

  "Synthetic telemetry stream established."

);


addEvent(

  "INFO",

  "LEO, MEO and GEO spacecraft monitoring active."

);
```
