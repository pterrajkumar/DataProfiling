import { DPAcceleratorClientPage } from './app.po';

describe('dpaccelerator-client App', () => {
  let page: DPAcceleratorClientPage;

  beforeEach(() => {
    page = new DPAcceleratorClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
