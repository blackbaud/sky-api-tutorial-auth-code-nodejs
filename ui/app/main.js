document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById("app");
    let popup = null;
    let intervalId = null;

    function initApp() {
        // Check if the user is authenticated
        fetch('/auth/authenticated')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    // User is authenticated, fetch constituent data
                    fetch('/api/constituents/280')
                        .then(response => response.json())
                        .then(data => {
                            const constituent = data;
                            renderConstituentData(constituent);
                        });
                } else {
                    renderLoginOptions();
                }
            });
    }

    // Render login options
    function renderLoginOptions() {
        const loginOptions = `
          <h1>SKY API Authorization Code Flow Tutorial</h1>
          <div class="well">
            <h4 class="well-title">Applications implementing the authorization code flow may be authorized in one of two ways:</h4>
            <div class="row">
              <div class="col-sm-6">
                <div class="panel panel-default panel-body">
                  <p>
                    <a href="/auth/login" class="btn btn-primary btn-block btn-lg"><i class="fa fa-external-link"></i> Authorize using redirect</a>
                  </p>
                  <p>
                    The user authorizes the application after being redirected to the Blackbaud Authorization website.
                  </p>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="panel panel-default panel-body">
                  <p>
                    <button id="popup-login" class="btn btn-primary btn-block btn-lg" target="login-iframe"><i class="fa fa-window-restore"></i> Authorize using popup</button>
                  </p>
                  <p>
                    The user authorizes the application using a browser popup window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
        app.innerHTML = loginOptions;

        // Add event listener to popup login button
        document.getElementById("popup-login").addEventListener("click", function () {
            if (popup && !popup.closed) {
                popup.focus();
                return;
            }

            popup = window.open('auth/login?redirect=/%23/auth-success', 'login', 'height=450,width=600');
            if (window.focus) {
                popup.focus();
            }

            intervalId = setInterval(function () {
                if (popup && popup.closed) {
                    clearInterval(intervalId);
                    intervalId = null;
                    popup = null;
                    return;
                }

                fetch('/auth/authenticated')
                    .then(response => response.json())
                    .then(data => {
                        if (data.authenticated) {
                            clearInterval(intervalId);
                            intervalId = null;
                            popup.close();
                            popup = null;
                            // User is authenticated, fetch constituent data
                            fetch('/api/constituents/280')
                                .then(response => response.json())
                                .then(data => {
                                    const constituent = data;
                                    renderConstituentData(constituent);
                                });
                        }
                    });
            }, 500);
        });
    }

    // Render constituent data
    function renderConstituentData(constituent) {
        const constituentData = `
        <h1>SKY API Authorization Code Flow Tutorial</h1>
          <div class="well">
            <h3 class="well-title">Constituent: ${constituent.name}</h3>
            <p>
              See <a href="https://developer.blackbaud.com/skyapi/products/renxt/constituent" target="_blank">Constituent</a>
              within the Blackbaud SKY API contact reference for a full listing of properties.
            </p>
          </div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>${constituent.id}</td>
                </tr>
                <tr>
                  <td>type</td>
                  <td>${constituent.type}</td>
                </tr>
                <tr>
                  <td>lookup_id</td>
                  <td>${constituent.lookup_id}</td>
                </tr>
                <tr>
                  <td>first</td>
                  <td>${constituent.first}</td>
                </tr>
                <tr>
                  <td>last</td>
                  <td>${constituent.last}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <a href="/auth/logout" class="btn btn-primary">Log out</a>
        `;
        app.innerHTML = constituentData;
    }

    initApp();
});