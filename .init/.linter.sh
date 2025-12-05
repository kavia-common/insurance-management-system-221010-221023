#!/bin/bash
cd /home/kavia/workspace/code-generation/insurance-management-system-221010-221023/insurance_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

