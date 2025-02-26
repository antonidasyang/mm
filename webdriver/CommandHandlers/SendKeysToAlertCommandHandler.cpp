// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements. See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership. The SFC licenses this file
// to you under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "SendKeysToAlertCommandHandler.h"
#include "errorcodes.h"
#include "../Alert.h"
#include "../Browser.h"
#include "../IECommandExecutor.h"

namespace webdriver {

SendKeysToAlertCommandHandler::SendKeysToAlertCommandHandler(void)
{
}

SendKeysToAlertCommandHandler::~SendKeysToAlertCommandHandler(void)
{
}

void SendKeysToAlertCommandHandler::ExecuteInternal(const IECommandExecutor& executor, const ParametersMap& command_parameters, Response* response)
{
    ParametersMap::const_iterator text_parameter_iterator = command_parameters.find("text");
    if (text_parameter_iterator == command_parameters.end()) {
        response->SetErrorResponse(ERROR_INVALID_ARGUMENT, "Missing parameter: text");
        return;
    }

    if (!text_parameter_iterator->second.isString()) {
        response->SetErrorResponse(ERROR_INVALID_ARGUMENT, "text must be a string");
        return;
    }

    std::string value = text_parameter_iterator->second.asString();

    BrowserHandle browser_wrapper;
    int status_code = executor.GetCurrentBrowser(&browser_wrapper);
    if (status_code != WD_SUCCESS) {
        response->SetErrorResponse(status_code, "Unable to get browser");
        return;
    }
    // This sleep is required to give IE time to draw the dialog.
    ::Sleep(100);
    HWND alert_handle = browser_wrapper->GetActiveDialogWindowHandle();
    if (alert_handle == NULL) {
        response->SetErrorResponse(ERROR_NO_SUCH_ALERT, "No alert is active");
    } else {
        Alert dialog(browser_wrapper, alert_handle);
        status_code = dialog.SendKeys(value);
        if (status_code != WD_SUCCESS) {
            if (status_code == EUNSUPPORTEDOPERATION) {
                response->SetErrorResponse(status_code, "Alert was not generated by the JavaScript alert(), confirm(), or prompt() functions");
                return;
            }
            response->SetErrorResponse(ERROR_ELEMENT_NOT_INTERACTABLE, "Modal dialog did not have a text box - maybe it was an alert");
            return;
        }
        response->SetSuccessResponse(Json::Value::null);
    }
}

} // namespace webdriver
