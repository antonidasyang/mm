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

#include "GetAlertTextCommandHandler.h"
#include "webdriver/server/errorcodes.h"
#include "webdriver/CommandHandlers/ElementUtil.h"
#include "mbvip/core/mb.h"

namespace webdriver {

GetAlertTextCommandHandler::GetAlertTextCommandHandler(void)
{
}

GetAlertTextCommandHandler::~GetAlertTextCommandHandler(void)
{
}

void GetAlertTextCommandHandler::ExecuteInternal(const MBCommandExecutor& executor, const ParametersMap& command_parameters, Response* response)
{
    mbWebView webview = executor.view();
    if (NULL_WEBVIEW == webview) {
        response->SetErrorResponse(ENOSUCHALERT, "Unable to get current browser");
        return;
    }

    JsQueryInfo* jsQueryInfo = (JsQueryInfo*)mbGetUserKeyValue(webview, "JsQueryInfo");
    if (!jsQueryInfo->isAlertOpen) {
        OutputDebugStringA("GetAlertTextCommandHandler, isAlertOpen == false\n");
        response->SetErrorResponse(ENOSUCHALERT, "No alert is active");
        return;
    }

    ::EnterCriticalSection(&jsQueryInfo->lock);
    std::string alertText = jsQueryInfo->alertText;
    ::LeaveCriticalSection(&jsQueryInfo->lock);

    response->SetSuccessResponse(alertText);

//     BrowserHandle browser_wrapper;
//     int status_code = executor.GetCurrentBrowser(&browser_wrapper);
//     if (status_code != WD_SUCCESS) {
//         response->SetErrorResponse(status_code, "Unable to get browser");
//         return;
//     }
//     // This sleep is required to give IE time to draw the dialog.
//     ::Sleep(100);
//     HWND alert_handle = browser_wrapper->GetActiveDialogWindowHandle();
//     if (alert_handle == NULL) {
//         response->SetErrorResponse(ENOSUCHALERT, "No alert is active");
//     } else {
//         Alert dialog(browser_wrapper, alert_handle);
//         std::string alert_text_value = dialog.GetText();
//         response->SetSuccessResponse(alert_text_value);
//     }
}

} // namespace webdriver
