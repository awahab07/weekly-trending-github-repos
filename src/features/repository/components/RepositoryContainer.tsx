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

  const seoTitle = 'Github | Trending Repositories';

  return (
    <>
      <Helmet>{seoTitle}</Helmet>09
      <div className="bg-gray-light border-bottom">
        <div className="container-lg p-responsive text-center py-6">
          <h1 className="h0-mktg">Trending</h1>
          <p className="f4 text-gray col-md-6 mx-auto">
            See which repositories are trending this week.
          </p>
        </div>
      </div>
      {repositories.map((r: IRepository) => (
        <p key={r.id}>{r.name}</p>
      ))}
    </>
  );
};

export default RepositoryContainer;
