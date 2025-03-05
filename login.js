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
                query: `{
                    user {
                        id
                        login
                        email
                        firstName
                        lastName
                        campus
                        attrs
                        transactions {
                            type
                            amount
                            createdAt
                        }
                        progresses {
                            grade
                            createdAt
                            isDone
                        }
                        auditRatio
                        totalUp
                        totalDown
                    }
                    transaction(
                        where: {
                            _and: [
                                {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
                                {type: {_like: "%skill%"}},
                                {object: {type: {_eq: "project"}}},
                                {type: {_in: [
                                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                                    "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                                    "skill_tcp"
                                ]}}
                            ]
                        }
                        order_by: [{type: asc}, {createdAt: desc}]
                        distinct_on: type
                    ) {
                        amount
                        type
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
