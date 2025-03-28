import BigRoomModel from "./environmentModel/BigRoom";
import CastleModel from "./environmentModel/Castle";
import SingleRoomModel from "./environmentModel/SingleRoom";

import bigRoomPlaceHolderData from "./placeHolderData/BigRoom";
import castlePlaceHolderData from "./placeHolderData/Castle";
import singleRoomPlaceHolderData from "./placeHolderData/SingleRoom";

import PlaceHolder from "./placeHolderData/PlaceHolder";

interface EnvironmentData {
  [environment_name: string]: {
    environmentModel: any;
    playerSpeed: number;
    playerHeight: number;
    placeHolderData: PlaceHolder[];
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
    environmentModel: BigRoomModel,
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
        position: [-5, 3.2, 13.35],
        rotation: [0, 90, 0],
        scale: 4
      },
      {
        position: [-5, 3.2, -13.35],
        rotation: [0, 90, 0],
        scale: 4
      }
    ]
    
  },
  
  "CASTLE": {
    environmentModel: CastleModel,
    playerSpeed: 17,
    playerHeight: 2,
    placeHolderData: castlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [-150, 100, 200],
        rotation: [-30, -60, 0],
        duration: 0
      },
      update: [
        {
          position: [-4.62, 2.3, 46],
          rotation: [0, -30, 0],
          duration: 4,
          ease: "power2.in"
        },
        {
          position: [10, 2.5, -25],
          rotation: [0, 0, 0],
          duration: 5,
          ease: "power2.out"
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
    environmentModel: SingleRoomModel,
    playerSpeed: 20,
    playerHeight: 2,
    placeHolderData: singleRoomPlaceHolderData,
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
        position: [-5, 3.2, 13.35],
        rotation: [0, 90, 0],
        scale: 4
      },
      {
        position: [-5, 3.2, -13.35],
        rotation: [0, 90, 0],
        scale: 4
      }
    ]
  },
};

export default environmentData;