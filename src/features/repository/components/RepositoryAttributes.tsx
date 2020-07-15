import { Box, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Computer, DeviceHub, StarRate } from '@material-ui/icons';
import React from 'react';
import { IRepository } from '../../../models';

const NumFormatter = new Intl.NumberFormat();

const getStarCount = (repo: IRepository): string =>
  NumFormatter.format(repo.stargazers_count + (repo.extras.starred ? 1 : 0));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 100,
  },
}));

const RepositoryAttributes = ({ repo }: { repo: IRepository }) => {
  const classes = useStyles();

  return (
    <Grid container direction={'row'} alignItems={'baseline'} spacing={2} wrap={'nowrap'}>
      <Grid classes={classes} container={true} item={true} alignItems={'flex-end'}>
        <Computer />
        <strong>{repo.language}</strong>
      </Grid>

      <Grid classes={classes} container={true} item={true} alignItems={'flex-end'}>
        <StarRate />
        {getStarCount(repo)}
      </Grid>

      <Grid classes={classes} container={true} item={true} alignItems={'flex-end'}>
        <DeviceHub />
        {NumFormatter.format(repo.forks_count)}
      </Grid>

      <Box alignItems={'flex-end'} borderRadius={'50%'} width={24} height={24} clone>
        <img src={repo.owner.avatar_url} />
      </Box>
    </Grid>
  );
};

export default RepositoryAttributes;
