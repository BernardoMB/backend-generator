const appInsights = require("applicationinsights");
import { Application } from 'express';
export = (app: Application, instrumentationKey: string) => {  
    appInsights.setup(instrumentationKey)
        .setAutoCollectRequests(false)
        .setAutoCollectExceptions(false).start();
}