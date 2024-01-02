import express from 'express';
import { getPayloadClient } from '../payload/get-payload';
import {nextHandler, nextApp} from './next-utils';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    const payload = await getPayloadClient(
        {
            initOptions: {
                express: app,
                onInit: async (cms) => {
                    cms.logger.info(`URL Admin ${cms.getAdminURL()}`)
                }
            }
        }
    );

    app.use((req, res) => nextHandler(req, res))

    nextApp.prepare().then(() => {
        // payload.logger.info('Next started')

        app.listen(PORT, async () => {
            // payload.logger.info(`App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
        })
    })
};

start();