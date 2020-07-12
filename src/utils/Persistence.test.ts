import { Persistence } from './Persistence';

describe('Github Api', () => {
  let persistence: Persistence;
  let setItemMock: jest.Mock;
  let getItemMock: jest.Mock;
  let windowMock: jest.MockInstance<Window, any>;

  beforeEach(() => {
    setItemMock = jest.fn();
    getItemMock = jest.fn();
    windowMock = jest.spyOn(global, 'window', 'get').mockReturnValue({localStorage: {setItem: setItemMock, getItem: getItemMock}} as any);
    persistence = new Persistence(window);
  });

  afterEach(() => {
    windowMock.mockRestore();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should call localStorage setItem when setting a value', () => {
    const key = 'STAR-IDS';
    const valueToSet = [1, 3, 49];
    const strigified = JSON.stringify(valueToSet);
    persistence.set(key, valueToSet);
    expect(setItemMock).toHaveBeenCalledWith(key, strigified);
  });

  test('should getItem from localStorage', () => {
    const key = 'STAR-IDS';
    const persistedValue = [1, 3, 49];
    getItemMock.mockReturnValue(JSON.stringify(persistedValue));
    persistence.get(key);
    expect(getItemMock).toHaveBeenCalledWith(key);
  });

  test('should return a parsed value from localStorage', () => {
    const key = 'STAR-IDS';
    const persistedValue = [1, 3, 49];
    getItemMock.mockReturnValue(JSON.stringify(persistedValue));
    const retrievedValue = persistence.get(key);
    expect(retrievedValue).toEqual(persistedValue);
  });
});
