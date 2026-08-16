FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:18 as build-image

WORKDIR ${LAMBDA_TASK_ROOT}

COPY . .

# @sparticuz/chromium takes care of installing the browser
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm install
RUN npx tsc

CMD [ "index.handler" ]
