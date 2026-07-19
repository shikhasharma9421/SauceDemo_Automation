pipeline {
    agent any
 
    tools {
        nodejs 'Node 20'
    }
 
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Install Playwright browsers') {
            steps {
                bat 'npx playwright install'
            }
        }
        stage('Run tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }
 
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}