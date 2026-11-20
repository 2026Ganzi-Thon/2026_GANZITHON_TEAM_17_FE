import {defineConfig} from 'vite';

/** Use the same VITE_API_BASE_URL as the integrated application. */
export default defineConfig({
 envDir:'..',
 resolve:{dedupe:['react','react-dom']},
});
