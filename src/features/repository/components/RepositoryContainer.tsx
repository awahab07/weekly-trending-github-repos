import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { IRepository } from '../../../models';
import { RootState } from '../../../store';
import { repositoryActions } from '../index';

const RepositoryContainer: FunctionComponent = (props: PropsWithChildren<{}>): ReactElement => {
  const dispatch = useDispatch();
  const { repositories } = useSelector((state: RootState) => state.repositorySlice, shallowEqual);

  useEffect(() => {
    dispatch(repositoryActions.getRepositories({ filters: [] }));
  }, []);

  const seoTitle = 'Github | Popular Repositories';

  return (
    <>
      <Helmet>{seoTitle}</Helmet>
      {repositories.map((r: IRepository) => (
        <p key={r.id}>{r.name}</p>
      ))}
    </>
  );
};

export default RepositoryContainer;
