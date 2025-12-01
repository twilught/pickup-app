pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Env') {
            steps {
                withCredentials([
                    string(credentialsId: 'POSTGRES_USER',     variable: 'POSTGRES_USER'),
                    string(credentialsId: 'POSTGRES_PASSWORD', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'POSTGRES_DB',       variable: 'POSTGRES_DB'),
                    string(credentialsId: 'DATABASE_URL',      variable: 'DATABASE_URL'),
                    string(credentialsId: 'API_PORT',          variable: 'API_PORT')
                ]) {
                    sh '''
                        echo "POSTGRES_USER=$POSTGRES_USER"       > .env
                        echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
                        echo "POSTGRES_DB=$POSTGRES_DB"           >> .env
                        echo "DATABASE_URL=$DATABASE_URL"         >> .env
                        echo "PORT=$API_PORT"                     >> .env
                        echo "NODE_ENV=production"                >> .env

                        echo "Generated .env file:"
                        cat .env
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo '⏳ Waiting for API service on port 4000...'
                    int maxAttempts = 12
                    int delaySeconds = 5
                    int attempt = 1
                    int lastCode = 0

                    while (attempt <= maxAttempts) {
                        echo "➡️  Attempt ${attempt}/${maxAttempts}..."
                        lastCode = sh(
                            script: 'curl -s -o /dev/null -w %{http_code} http://localhost:4000/health || echo 000',
                            returnStdout: true
                        ).trim() as Integer

                        if (lastCode == 200) {
                            echo "✅ API is healthy! (HTTP ${lastCode})"
                            return
                        }

                        echo "❌ API not ready yet (HTTP ${lastCode})"
                        sleep time: delaySeconds, unit: 'SECONDS'
                        attempt++
                    }

                    error "API did not become healthy in time (last HTTP code: ${lastCode})"
                }
            }
        }
    }
}
