import { TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { ChangeEvent } from 'react';
import { useAppStyles } from '../../../app/theme';
import { IRepository } from '../../../models';
import { IRepositoryFilter } from '../../../shared';
import { BoxGrid } from '../../../shared/BoxComponents';
import Repository from './Repository';

interface IRepositoryListProps {
  repositories: IRepository[];
  availableLanguages: string[];
  filters: IRepositoryFilter[];
  onStarRepo: (repo: IRepository) => void;
  onUpdateFilter: (filter: IRepositoryFilter) => void;
}

const useAutocompleteStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 200,
  },
}));

const RepositoryList: React.FunctionComponent<IRepositoryListProps> = (
  props: IRepositoryListProps
): React.ReactElement => {
  const appClasses = useAppStyles();
  const autocompleteClasses = useAutocompleteStyles();

  const { repositories } = props;

  const getAppliedRepositoryTypeFilter = () =>
    props.filters.find((f) => f.key === 'starred')?.value ?? 'false';

  const getAppliedLanguageFilter = () => props.filters.find((f) => f.key === 'language')?.value ?? null;

  const handleStarredToggle = (event: any, value: string) => {
    props.onUpdateFilter({ key: 'starred', operator: '=', value });
  };

  const handleLanguageChange = (
    event: ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {
    props.onUpdateFilter({ key: 'language', operator: '=', value: value ?? '' });
  };

  return (
    <>
      <BoxGrid my={2} className={appClasses.headerBorder} border={1}>
        <BoxGrid
          p={4}
          justifyContent={'space-between'}
          className={appClasses.sectionBg}
          display={'flex'}
          flexDirection={'row'}
          clone={true}
        >
          <section>
            <ToggleButtonGroup
              value={getAppliedRepositoryTypeFilter()}
              color={'primary'}
              exclusive
              onChange={handleStarredToggle}
              aria-label={'Repositories All or Starred'}
            >
              <ToggleButton value={'false'} aria-label={'All Repositories'}>
                All Repositories
              </ToggleButton>
              <ToggleButton value={'true'} aria-label={'Starred Repositories'}>
                Starred Repositories
              </ToggleButton>
            </ToggleButtonGroup>

            <Autocomplete
              id={'language-filter'}
              classes={autocompleteClasses}
              options={props.availableLanguages}
              value={getAppliedLanguageFilter()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={getAppliedLanguageFilter() ? 'Language' : 'Language (Any)'}
                />
              )}
              onChange={handleLanguageChange}
            />
          </section>
        </BoxGrid>
        {repositories.map((repo: IRepository, index: number) => (
          <Repository
            key={repo.id}
            className={appClasses.fadeBorder}
            repo={repo}
            onStarRepo={props.onStarRepo}
          />
        ))}
      </BoxGrid>
    </>
  );
};

export default RepositoryList;
