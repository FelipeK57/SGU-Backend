#!/bin/sh
echo "Esperando a que la DB esté lista..."
until pg_isready -h db -U sgu_user -d sgu; do
  sleep 1
done
echo "DB lista, arrancando backend..."
npm run sync
npm start
