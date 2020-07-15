import { Box } from '@material-ui/core';
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAppStyles } from '../../../app/theme';
import { IRepository } from '../../../models';
import { IRepositoryFilter } from '../../../shared';
import BoxTypography from '../../../shared/BoxComponents/BoxTypography';
import ErrorRenderer from '../../../shared/ErrorRenderer/ErrorRenderer';
import Spinner from '../../../shared/Spinner/Spinner';
import { RootState } from '../../../store';
import { repositoryActions } from '../index';
import RepositoryList from './RepositoryList';

const RepositoryContainer: FunctionComponent = (props: PropsWithChildren<{}>): ReactElement => {
  const appClasses = useAppStyles();
  const dispatch = useDispatch();
  const { repositories, loading, error } = useSelector(
    (state: RootState) => state.repositorySlice,
    shallowEqual
  );

  const [filters, setFilters] = useState<IRepositoryFilter[]>([]);

  useEffect(() => {
    dispatch(repositoryActions.getRepositories({ filters }));
  }, [filters]);

  // For demonstration, using hard coded values
  const availableLanguages: string[] = [
    'JavaScript',
    'Python',
    'TypeScript',
    'Swift',
    'Java',
    'PHP',
    'Go',
    'Rust',
  ];

  const seoTitle = 'Github | Trending Repositories';

  const handleStarRepo = (repo: IRepository): void => {
    dispatch(
      repositoryActions.updateRepositoryStarred({
        repository: repo,
        star: !repo.extras.starred,
        filters,
      })
    );
  };

  const handleFilterUpdate = (filter: IRepositoryFilter): void => {
    setFilters((prevFilters) => {
      const otherFilters = prevFilters.filter((f) => f.key !== filter.key);

      if ((filter.value ?? null) !== null && filter.value !== '') {
        return [filter, ...otherFilters];
      }

      return otherFilters;
    });
  };

  return (
    <>
      <Helmet>{seoTitle}</Helmet>

      {loading ? <Spinner /> : null}

      <Box
        display={'flex'}
        p={2}
        className={appClasses.sectionBg}
        flexDirection={'column'}
        alignItems={'center'}
        width={1}
        component={'section'}
      >
        <BoxTypography variant={'h1'}>Trending</BoxTypography>

        <BoxTypography variant={'subtitle1'}>
          See which repositories are trending this week.
        </BoxTypography>
      </Box>

      {error ? <ErrorRenderer message={error} /> : null}

      <RepositoryList
        repositories={repositories}
        availableLanguages={availableLanguages}
        filters={filters}
        onStarRepo={handleStarRepo}
        onUpdateFilter={handleFilterUpdate}
      />
    </>
  );
};

export default RepositoryContainer;
