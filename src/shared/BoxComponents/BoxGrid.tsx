import { Box, BoxProps, Grid, GridProps } from '@material-ui/core';
import React, { FunctionComponent, PropsWithChildren } from 'react';

export interface IBoxGridProps extends PropsWithChildren<BoxProps & GridProps> {
  relative?: boolean;
  fromTop?: number | string;
  fromBottom?: number | string;
  fromLeft?: number | string;
  fromRight?: number | string;
}

const omitCustomProps = (props: IBoxGridProps): IBoxGridProps => {
  const { relative, fromTop, fromBottom, fromLeft, fromRight, ...rest } = props;

  return rest;
};

const computeOverrideBoxProps = (props: IBoxGridProps): IBoxGridProps => {
  let computedProps = {};

  if (props.relative === true) {
    computedProps = { ...computedProps, position: 'relative' };
  }

  if (props.fromTop !== undefined) {
    computedProps = { ...computedProps, position: 'absolute', top: props.fromTop };
  }

  if (props.fromBottom !== undefined) {
    computedProps = { ...computedProps, position: 'absolute', bottom: props.fromBottom };
  }

  if (props.fromLeft !== undefined) {
    computedProps = { ...computedProps, position: 'absolute', left: props.fromLeft };
  }

  if (props.fromRight !== undefined) {
    computedProps = { ...computedProps, position: 'absolute', right: props.fromRight };
  }

  return computedProps;
};

const BoxGrid: FunctionComponent<IBoxGridProps> = (props: IBoxGridProps) => {
  return (
    <Box {...omitCustomProps(props)} component={Grid} {...computeOverrideBoxProps(props)}>
      {props.children}
    </Box>
  );
};

export default BoxGrid;
