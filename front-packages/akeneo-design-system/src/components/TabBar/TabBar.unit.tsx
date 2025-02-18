import React from 'react';
import {TabBar} from './TabBar';
import {render, screen, act} from '../../storybook/test-util';
import userEvent from '@testing-library/user-event';

type EntryCallback = (entries: {isIntersecting: boolean}[]) => void;

let entryCallback: EntryCallback | undefined = undefined;
const intersectionObserverMock = (callback: EntryCallback) => ({
  observe: jest.fn(() => (entryCallback = callback)),
  unobserve: jest.fn(),
});
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

test('TabBar supports ...rest props', () => {
  render(<TabBar moreButtonTitle="More" data-testid="my_value" />);
  expect(screen.getByTestId('my_value')).toBeInTheDocument();
});

test('it renders its children properly', () => {
  const handleClick = jest.fn();

  render(
    <TabBar moreButtonTitle="More">
      <TabBar.Tab isActive={false} onClick={handleClick}>
        First tab
      </TabBar.Tab>
      <TabBar.Tab isActive={false}>Another tab</TabBar.Tab>
      <TabBar.Tab isActive={false}>Last tab</TabBar.Tab>
    </TabBar>
  );

  act(() => {
    entryCallback?.([{isIntersecting: true}]);
  });

  userEvent.click(screen.getByText('First tab'));
  expect(handleClick).toBeCalled();
});

test('it throws when using invalid children', () => {
  const mockConsole = jest.spyOn(console, 'error').mockImplementation();

  expect(() =>
    render(
      <TabBar moreButtonTitle="More">
        <TabBar.Tab isActive={false}>First tab</TabBar.Tab>
        Invalid child
      </TabBar>
    )
  ).toThrowError();

  mockConsole.mockRestore();
});

test('it throws when using TabBar.Tab without TabBar', () => {
  const mockConsole = jest.spyOn(console, 'error').mockImplementation();

  expect(() => render(<TabBar.Tab isActive={false}>First tab</TabBar.Tab>)).toThrowError();

  mockConsole.mockRestore();
});

test('it displays a Dropdown button when having a lot of tabs', () => {
  const handleClick = jest.fn();

  render(
    <TabBar moreButtonTitle="More">
      <TabBar.Tab isActive={false}>First tab</TabBar.Tab>
      <TabBar.Tab isActive={false}>Another tab</TabBar.Tab>
      <TabBar.Tab isActive={false} onClick={handleClick}>
        Last tab
      </TabBar.Tab>
    </TabBar>
  );

  act(() => {
    entryCallback?.([{isIntersecting: false}]);
  });

  userEvent.click(screen.getByTitle('More'));
  userEvent.click(screen.getByTitle('Last tab'));

  expect(handleClick).toHaveBeenCalled();

  act(() => {
    entryCallback?.([{isIntersecting: true}]);
  });
});
