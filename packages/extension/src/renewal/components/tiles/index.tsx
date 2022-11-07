import React, { FunctionComponent, ReactChild } from "react";
import { flattenChildren } from "../../utils/react";
import { Box } from "../box";
import { Column, Columns } from "../columns";

export interface TilesProps {
  columns: number;
  space: string;
}

export const Tiles: FunctionComponent<TilesProps> = ({
  columns,
  space,
  children,
}) => {
  const flattenedChilren = flattenChildren(children);
  const tiledChilren = flattenedChilren.reduce<ReactChild[][]>(
    (acc, cur, index) => {
      // the ~ operator will truncate any fractional component of an input Number
      const targetIndex = ~~(index / columns);
      if (!acc[targetIndex]) {
        acc[targetIndex] = [];
      }
      acc[targetIndex].push(cur);
      return acc;
    },
    []
  );

  return (
    <Box marginTop={`-${space}`}>
      {tiledChilren.map((columnsChildren, rowIndex) => (
        <Columns key={rowIndex} space={space} paddingTop={space}>
          {columnsChildren.map((columnChild, columnIndex) => (
            <Column key={`${rowIndex}${columnIndex}`}>{columnChild}</Column>
          ))}
        </Columns>
      ))}
    </Box>
  );
};
