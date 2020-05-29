import { Page } from 'puppeteer';
declare function useProxy(page: Page, proxy: string): Promise<void>;
export default useProxy;
