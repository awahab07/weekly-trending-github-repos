import { Button, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub, Star, StarBorder } from '@material-ui/icons';
import React from 'react';
import { IRepository } from '../../../models';
import { BoxGrid } from '../../../shared/BoxComponents';
import BoxTypography from '../../../shared/BoxComponents/BoxTypography';
import RepositoryAttributes from './RepositoryAttributes';

interface IRepositoryProps {
  repo: IRepository;
  className?: string;
  onStarRepo: (repo: IRepository) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  repositoryLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    fontSize: theme.typography.h2.fontSize,
  },
}));

const Repository: React.FunctionComponent<IRepositoryProps> = (
  props: IRepositoryProps
): React.ReactElement => {
  const classes = useStyles();
  const { repo, onStarRepo } = props;

  const handleStarClick = () => {
    onStarRepo(repo);
  };

  return (
    <>
      <BoxGrid container className={props.className} p={2} pt={4} alignItems={'center'} borderTop={1}>
        <BoxGrid flexDirection={'column'} clone={true} width={9 / 10}>
          <article>
            <BoxGrid container spacing={2} alignItems={'center'}>
              <BoxGrid width={32} clone>
                <GitHub fontSize={'small'} />
              </BoxGrid>

              <a className={classes.repositoryLink} href={repo.html_url} target={'_blank'}>
                <BoxTypography variant={'subtitle1'}>
                  {repo.owner.login} / <strong>{repo.name}</strong>
                </BoxTypography>
              </a>
            </BoxGrid>

            <BoxTypography py={2} variant={'body1'}>
              {repo.description}
            </BoxTypography>

            <RepositoryAttributes repo={repo} />
          </article>
        </BoxGrid>

        <Button
          color={'primary'}
          onClick={handleStarClick}
          title={repo.extras.starred ? 'Un Star Repo' : 'Star Repo'}
          aria-label={repo.extras.starred ? 'Un Star Repo' : 'Star Repo'}
        >
          {repo.extras.starred ? (
            <>
              <Star />
            </>
          ) : (
            <>
              <StarBorder />
            </>
          )}
        </Button>
      </BoxGrid>
    </>
  );
};

export default Repository;
