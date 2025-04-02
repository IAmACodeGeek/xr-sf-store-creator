import bigRoomPlaceHolderData from "./placeHolderData/BigRoom";
import castlePlaceHolderData from "./placeHolderData/Castle";
import singleRoomPlaceHolderData from "./placeHolderData/SingleRoom";

import PlaceHolderData from "./placeHolderData/PlaceHolderData";

interface EnvironmentData {
  [environment_name: string]: {
    playerSpeed: number;
    playerHeight: number;
    placeHolderData: PlaceHolderData[];
    initialGSAP: {
      start: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
      };
      update: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
        ease?: string;
      }[];
    };
    televisions: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
    brandPosters: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
  };
}

const environmentData: EnvironmentData = {
  "BIGROOM": {
    playerSpeed: 10,
    playerHeight: 2,
    placeHolderData: bigRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [40, 4, 0],
        rotation: [0, 90, 0],
        duration: 0
      },
      update: [
        {
          position: [40, 4, 0],
          rotation: [0, 270, 0],
          duration: 5
        },
        {
          position: [20, 3.2, 0],
          rotation: [0, 270, 0],
          duration: 2
        },
      ]
    },
    televisions: [
      {
        position: [47.8, 4.5, 0],
        rotation: [0, 180, 0],
        scale: 0.37
      }
    ],
    brandPosters: [
      {
        position: [-5, 3.2, 14.3],
        rotation: [0, 90, 0],
        scale: 4
      },
      {
        position: [-5, 3.2, -12.4],
        rotation: [0, 90, 0],
        scale: 4
      }
    ]
    
  },
  
  "CASTLE": {
    playerSpeed: 17,
    playerHeight: 2,
    placeHolderData: castlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [-4.62, 2.3, 46],
        rotation: [0, -30, 0],
        duration: 0,
      },
      update: [
        {
          position: [10, 2.5, -25],
          rotation: [0, 0, 0],
          duration: 4,
          ease: "power2.inOut"
        }
      ]
    },
    televisions: [
      {
        position: [-7.3, 33, -136.5],
        rotation: [0, 276, 0],
        scale: 0.8
      }
    ],
    brandPosters: [
      {
        position: [-3.2, 10, -84],
        rotation: [2, 90, 0],
        scale: 5
      }
    ]
  },
  "SINGLEROOM": {
    playerSpeed: 15,
    playerHeight: 2,
    placeHolderData: singleRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        duration: 0
      },
      update: [
        {
          position: [0, 4, 0],
          rotation: [0, 360, 0],
          duration: 5
        },
        {
          position: [0, 3.2, 18],
          rotation: [0, 360, 0],
          duration: 2
        },
      ]
    },
    televisions: [
      {
        position: [0, 4.5, -17.1],
        rotation: [0, -90, 0],
        scale: 0.6
      }
    ],
    brandPosters: [
      {
        position: [9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3
      },
      {
        position: [-9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3
      }
    ]
  },
};

export default environmentData;