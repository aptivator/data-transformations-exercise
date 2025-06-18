import {data}         from './_data/data';
import {dataPipeline} from './data-pipeline/data-pipeline';
import {runPipeline}  from './runner/runner';

runPipeline(dataPipeline, data);
