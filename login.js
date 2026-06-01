document.querySelector('form').addEventListener('submit', handleLogin);

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const credentials = btoa(`${username}:${password}`);
    try {
        const authResponse = await fetch('https://learn.reboot01.com/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (!authResponse.ok) {
            throw new Error('Authentication failed');
        }
        
        const token = await authResponse.json();
        localStorage.setItem('jwt_token', token);

        // Fetch user data with the complete query
        const userDataResponse = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query FullDashboardQuery {
                  user {
                    id
                    login
                    email
                    firstName
                    lastName
                    campus
                    attrs
                    profile
                    avatarUrl

                    auditRatio
                    totalUp
                    totalUpBonus
                    totalDown

                    roles {
                      slug
                    }

                    labels {
                      labelName
                      labelId
                      eventId
                    }

                    records {
                      startAt
                      endAt
                      message
                      createdAt
                      type {
                        canAccessPlatform
                        isPermanent
                        canBeAuditor
                        label
                        type
                      }
                    }

                    transactions(
                      order_by: [{ type: desc }, { amount: desc }]
                      distinct_on: [type]
                      where: {
                        type: { _like: "skill_%" }
                      }
                    ) {
                      type
                      amount
                      createdAt
                    }

                    progresses {
                      id
                      path
                      grade
                      isDone
                      createdAt
                      updatedAt
                      eventId
                    }
                  }

                  campuses: object(where: { type: { _eq: "campus" } }) {
                    name
                  }

                  skillTransactions: transaction(
                    where: {
                      _and: [
                        {
                          type: {
                            _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])"
                          }
                        }
                        {
                          type: {
                            _like: "%skill%"
                          }
                        }
                        {
                          object: {
                            type: {
                              _eq: "project"
                            }
                          }
                        }
                        {
                          type: {
                            _in: [
                              "skill_prog"
                              "skill_algo"
                              "skill_sys-admin"
                              "skill_front-end"
                              "skill_back-end"
                              "skill_stats"
                              "skill_ai"
                              "skill_game"
                              "skill_tcp"
                            ]
                          }
                        }
                      ]
                    }
                    order_by: [{ type: asc }, { createdAt: desc }]
                    distinct_on: [type]
                  ) {
                    amount
                    type
                    createdAt
                  }

                  xpTransactions: transaction(
                    where: {
                      type: { _eq: "xp" }
                    }
                    order_by: { createdAt: desc }
                  ) {
                    amount
                    type
                    createdAt
                    path
                    object {
                      name
                      type
                    }
                  }

                  levelTransactions: transaction(
                    where: {
                      type: { _eq: "level" }
                    }
                    order_by: { createdAt: desc }
                  ) {
                    amount
                    type
                    createdAt
                    path
                  }

                  latestProgresses: progress(
                    order_by: [{ path: desc }, { createdAt: desc }, { grade: desc }]
                    distinct_on: [path]
                  ) {
                    id
                    path
                    grade
                    isDone
                    version
                    createdAt
                    updatedAt
                    eventId
                    object {
                      name
                      type
                    }
                    event {
                      id
                      startAt
                      endAt
                      path
                    }
                  }
                }`
            })
        });

        const userData = await userDataResponse.json();
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = 'profile.html';

    } catch (error) {
        document.getElementById('errorMessage').style.display = 'block';
    }
}
