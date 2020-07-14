import { Typography, TypographyProps } from '@material-ui/core';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import BoxGrid, { IBoxGridProps } from './BoxGrid';

interface IBoxTypographyProps extends PropsWithChildren<IBoxGridProps & TypographyProps> {}

export const typographyOnlyProps = (props: PropsWithChildren<IBoxGridProps & TypographyProps>) => {
  const { variant, gutterBottom } = props;

  return { variant, gutterBottom };
};

export const boxGridOnlyProps = (props: PropsWithChildren<IBoxGridProps & TypographyProps>) => {
  const { variant, gutterBottom, ...rest } = props;

  return rest;
};

const BoxTypography: FunctionComponent<IBoxTypographyProps> = (props: IBoxTypographyProps) => {
  return (
    <BoxGrid {...boxGridOnlyProps(props)}>
      <Typography {...typographyOnlyProps(props)}>{props.children}</Typography>
    </BoxGrid>
  );
};

export default BoxTypography;
