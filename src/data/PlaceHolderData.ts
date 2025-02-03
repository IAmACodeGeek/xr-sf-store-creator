interface PlaceHolderData {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const placeHolderData: PlaceHolderData[] = [
  {
    id: 0,
    position: [10, 4.2, -7.5],
    rotation: [0, -90, 0],
    scale: 4
  },
  {
    id: 1,
    position: [10, 4.2, 7.5],
    rotation: [0, -90, 0],
    scale: 4
  },
  {
    id: 2,
    position: [26.5, 4.2, 7.5],
    rotation: [0, -90, 0],
    scale: 3
  },
  {
    id: 3,
    position: [26.5, 4.2, -7.5],
    rotation: [0, -90, 0],
    scale: 3
  },
];

export default placeHolderData;