import { useState, useMemo, useEffect } from 'react'
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  FileText,
  Code,
  Building2,
  Settings,
  Shield,
  TestTube,
  Container,
  Eye,
  AlertTriangle,
  Sparkles,
  Pencil,
  RotateCcw
} from 'lucide-react'

const FRONTEND_FRAMEWORKS = [
  'React',
  'Vue',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'Angular',
  'Remix',
  'Astro',
  'Solid.js'
]

const BACKEND_FRAMEWORKS = [
  'Node.js/Express',
  'FastAPI',
  'Django',
  'Flask',
  'NestJS',
  'Fastify',
  'Koa',
  'Hapi',
  'Spring Boot',
  'ASP.NET Core'
]

const DATABASES = [
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'MariaDB',
  'Cassandra',
  'DynamoDB',
  'Elasticsearch',
  'Neo4j'
]

const DATABASE_MIGRATIONS = [
  'Alembic (Python)',
  'Django Migrations',
  'Flask-Migrate',
  'Laravel Migrations',
  'Rails Migrations',
  'TypeORM Migrations',
  'Prisma Migrate',
  'Sequelize Migrations',
  'Knex.js Migrations',
  'Flyway',
  'Liquibase',
  'db-migrate'
]

// Framework compatibility mappings
const FRAMEWORK_COMPATIBILITY = {
  // Node.js/Express
  'Node.js/Express': {
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Cassandra', 'DynamoDB', 'Elasticsearch', 'Neo4j'],
    migrations: ['TypeORM Migrations', 'Prisma Migrate', 'Sequelize Migrations', 'Knex.js Migrations', 'db-migrate'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'NATS', 'Apache Pulsar'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Write-behind caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Nginx', 'Traefik', 'Envoy'],
    testing: ['Jest', 'Vitest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Selenium'],
    apiTesting: ['Axios', 'cURL', 'Postman', 'Insomnia', 'Supertest', 'Newman', 'Karate']
  },
  // FastAPI
  'FastAPI': {
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Cassandra', 'DynamoDB', 'Elasticsearch'],
    migrations: ['Alembic (Python)', 'Flyway', 'Liquibase'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'NATS', 'Apache Pulsar'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Write-behind caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Azure API Management', 'Nginx', 'Traefik', 'Envoy'],
    testing: ['Pytest', 'Jest', 'Vitest'],
    apiTesting: ['Axios', 'cURL', 'Postman', 'Insomnia', 'REST Assured', 'Newman', 'Karate']
  },
  // Django
  'Django': {
    databases: ['PostgreSQL', 'MySQL', 'SQLite', 'MariaDB', 'Oracle'],
    migrations: ['Django Migrations', 'Alembic (Python)', 'Flyway', 'Liquibase'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'NATS'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Azure API Management', 'Nginx', 'Traefik', 'Envoy'],
    testing: ['Pytest', 'JUnit'],
    apiTesting: ['Axios', 'cURL', 'Postman', 'Insomnia', 'REST Assured', 'Newman', 'Karate']
  },
  // Flask
  'Flask': {
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB'],
    migrations: ['Flask-Migrate', 'Alembic (Python)', 'Flyway', 'Liquibase'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'NATS'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Nginx', 'Traefik', 'Envoy'],
    testing: ['Pytest', 'Jest'],
    apiTesting: ['Axios', 'Postman', 'Insomnia', 'REST Assured', 'Newman', 'Karate']
  },
  // NestJS
  'NestJS': {
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Cassandra'],
    migrations: ['TypeORM Migrations', 'Prisma Migrate', 'Sequelize Migrations', 'Knex.js Migrations'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'NATS'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Nginx', 'Traefik', 'Envoy'],
    testing: ['Jest', 'Vitest'],
    apiTesting: ['Axios', 'cURL', 'Postman', 'Insomnia', 'Supertest', 'Newman']
  },
  // Spring Boot
  'Spring Boot': {
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Cassandra', 'Neo4j'],
    migrations: ['Flyway', 'Liquibase'],
    messaging: ['RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'Amazon SQS', 'Amazon SNS', 'Azure Service Bus', 'NATS', 'Apache Pulsar', 'ActiveMQ'],
    caching: ['In-memory caching (Redis)', 'Distributed caching', 'Cache-aside pattern', 'Write-through caching', 'Write-behind caching', 'Cache invalidation strategy', 'TTL-based expiration', 'LRU eviction policy', 'CDN caching', 'Application-level caching'],
    apiGateways: ['Kong', 'AWS API Gateway', 'Azure API Management', 'Nginx', 'Traefik', 'Envoy', 'Zuul', 'Ambassador'],
    testing: ['JUnit', 'Jest'],
    apiTesting: ['Axios', 'cURL', 'Postman', 'Insomnia', 'REST Assured', 'Newman', 'Karate']
  }
}

const MESSAGING_SYSTEMS = [
  'RabbitMQ',
  'Apache Kafka',
  'Redis Pub/Sub',
  'Amazon SQS',
  'Amazon SNS',
  'Azure Service Bus',
  'Google Pub/Sub',
  'NATS',
  'Apache Pulsar',
  'ActiveMQ'
]

const CACHING_STRATEGIES = [
  'In-memory caching (Redis)',
  'Distributed caching',
  'Cache-aside pattern',
  'Write-through caching',
  'Write-behind caching',
  'Cache invalidation strategy',
  'TTL-based expiration',
  'LRU eviction policy',
  'CDN caching',
  'Application-level caching'
]

const API_GATEWAYS = [
  'Kong',
  'AWS API Gateway',
  'Azure API Management',
  'Nginx',
  'Traefik',
  'Envoy',
  'Zuul',
  'Ambassador'
]

const API_CONTRACTS = [
  'OpenAPI/Swagger',
  'GraphQL',
  'REST',
  'gRPC',
  'tRPC',
  'JSON-RPC'
]

const TESTING_FRAMEWORKS = [
  'Jest',
  'Vitest',
  'Mocha',
  'Chai',
  'Pytest',
  'JUnit',
  'Cypress',
  'Playwright',
  'Selenium'
]

const API_TESTING_TOOLS = [
  'Axios',
  'cURL',
  'Postman',
  'Insomnia',
  'REST Assured',
  'Supertest',
  'Newman',
  'Karate',
  'Pact'
]

const AI_FRAMEWORKS = [
  'LangChain',
  'LlamaIndex',
  'Haystack',
  'Semantic Kernel',
  'AutoGPT',
  'BabyAGI',
  'LangGraph',
  'CrewAI'
]

const VECTOR_DATABASES = [
  'Qdrant (local)',
  'Qdrant (cloud)',
  'Pinecone',
  'Weaviate',
  'Milvus',
  'Chroma',
  'FAISS',
  'Elasticsearch (vector)',
  'PGVector',
  'Redis (vector)'
]

const AI_TESTING_TOOLS = [
  'LangSmith',
  'Weights & Biases',
  'MLflow',
  'Evidently AI',
  'Giskard',
  'Kolena'
]

const OBSERVABILITY_TOOLS = [
  'Prometheus',
  'Grafana',
  'Datadog',
  'New Relic',
  'Sentry',
  'ELK Stack',
  'Loki',
  'Jaeger',
  'Zipkin'
]

const VALIDATION_LIBRARIES = [
  'Joi',
  'Yup',
  'Zod',
  'class-validator',
  'express-validator',
  'validator.js',
  'ajv',
  'joi-express',
  'express-joi-validation',
  'celebrate',
  'marshmallow',
  'pydantic',
  'cerberus',
  'voluptuous'
]

// Additional complementary options
const API_TESTING_OPTIONS = [
  'Prefer OpenAPI-driven API tests.',
  'Curl examples must be runnable.',
  'Axios or curl-based tests are acceptable if they map cleanly to Postman collections.'
]

const AI_FRAMEWORK_OPTIONS = [
  'Use LangChain for AI features.',
  'Allowed: prompt templates, chains, tool calling.',
  'Avoid autonomous agents unless explicitly requested.',
  'Isolate AI logic behind clear service boundaries.',
  'Prompts must be versioned.',
  'Provide offline / mock mode for tests.',
  'Do not call real LLMs in CI by default.',
  'Ask before adding new mock frameworks or prompt-evaluation strategies.'
]

const AI_TESTING_OPTIONS = [
  'Mock LLM calls by default.',
  'Validate structure, schema, and contracts rather than exact text.',
  'Explicitly test timeout and degraded-response scenarios.'
]

const OBSERVABILITY_OPTIONS = [
  'Structured JSON logging.',
  'Request ID propagation across services.',
  'Metrics endpoint required.',
  'Health check endpoints required.'
]

const SECURITY_DEFAULTS = [
  'HTTPS Only',
  'CORS Configuration',
  'Rate Limiting',
  'Input Validation',
  'SQL Injection Protection',
  'XSS Protection',
  'CSRF Protection',
  'Authentication/Authorization',
  'Secrets Management',
  'Security Headers'
]

const FAILURE_FIRST_OPTIONS = [
  'Circuit Breaker Pattern',
  'Retry with Exponential Backoff',
  'Graceful Degradation',
  'Health Checks',
  'Dead Letter Queues',
  'Bulkhead Pattern',
  'Timeout Handling',
  'Fallback Mechanisms'
]

const TESTING_PHILOSOPHY_OPTIONS = [
  'Focus on E2E testing only.',
  'Generate Playwright tests for user-facing behavior changes.',
  'Ask before generating tests when impact is unclear.',
  'When implementing features, reason through how tests validate correctness.',
  'Add negative tests and explicitly test failure paths.',
  'Simulate partial outages where relevant (e.g., downstream service failure, LLM timeout).',
  'Cursor should verify its own work by reasoning through how Playwright tests would pass or fail.'
]

const DOCKER_ENV_OPTIONS = [
  'Docker-first development.',
  'Use docker-compose for local environments.',
  'Local Postgres runs via Docker Compose.',
  'Schema changes require migrations.',
  'Use `.env` files with validation.',
  'Never hardcode secrets.'
]

function RequirementsConstructor({ onNavigateBack }) {
  const [copied, setCopied] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState('')
  const [isEditing, setIsEditing] = useState(true) // Default to edit mode
  const [lastAutoGenerated, setLastAutoGenerated] = useState('')
  
  // Technical Architecture
  const [frontendFramework, setFrontendFramework] = useState('')
  const [customFrontend, setCustomFrontend] = useState('')
  const [backendFramework, setBackendFramework] = useState('')
  const [customBackend, setCustomBackend] = useState('')
  const [database, setDatabase] = useState('')
  const [customDatabase, setCustomDatabase] = useState('')
  const [databaseMigrations, setDatabaseMigrations] = useState('')
  const [customDatabaseMigrations, setCustomDatabaseMigrations] = useState('')
  const [messaging, setMessaging] = useState('')
  const [customMessaging, setCustomMessaging] = useState('')
  const [cachingStrategy, setCachingStrategy] = useState([])
  const [customCachingStrategy, setCustomCachingStrategy] = useState('')
  const [apiGateway, setApiGateway] = useState('')
  const [customApiGateway, setCustomApiGateway] = useState('')
  const [apiContracts, setApiContracts] = useState('')
  const [customApiContracts, setCustomApiContracts] = useState('')
  const [testingFramework, setTestingFramework] = useState('')
  const [customTesting, setCustomTesting] = useState('')
  const [apiTesting, setApiTesting] = useState('')
  const [customApiTesting, setCustomApiTesting] = useState('')
  const [apiTestingOptions, setApiTestingOptions] = useState([])
  const [customApiTestingOptions, setCustomApiTestingOptions] = useState('')
  const [aiFramework, setAiFramework] = useState('')
  const [customAiFramework, setCustomAiFramework] = useState('')
  const [aiFrameworkOptions, setAiFrameworkOptions] = useState([])
  const [customAiFrameworkOptions, setCustomAiFrameworkOptions] = useState('')
  const [vectorDatabase, setVectorDatabase] = useState('')
  const [customVectorDatabase, setCustomVectorDatabase] = useState('')
  const [aiTesting, setAiTesting] = useState('')
  const [customAiTesting, setCustomAiTesting] = useState('')
  const [aiTestingOptions, setAiTestingOptions] = useState([])
  const [customAiTestingOptions, setCustomAiTestingOptions] = useState('')
  const [dockerEnv, setDockerEnv] = useState([])
  const [customDockerEnv, setCustomDockerEnv] = useState('')
  const [observability, setObservability] = useState('')
  const [customObservability, setCustomObservability] = useState('')
  const [observabilityOptions, setObservabilityOptions] = useState([])
  const [customObservabilityOptions, setCustomObservabilityOptions] = useState('')
  const [securityDefaults, setSecurityDefaults] = useState([])
  const [customSecurity, setCustomSecurity] = useState('')
  const [failureFirst, setFailureFirst] = useState([])
  const [customFailureFirst, setCustomFailureFirst] = useState('')
  const [testingPhilosophy, setTestingPhilosophy] = useState([])
  const [customTestingPhilosophy, setCustomTestingPhilosophy] = useState('')
  const [modelValidation, setModelValidation] = useState('')
  const [customModelValidation, setCustomModelValidation] = useState('')
  
  // Business Rules
  const [businessRules, setBusinessRules] = useState('')
  
  // Additional Sections
  const [additionalRequirements, setAdditionalRequirements] = useState('')
  const [userStories, setUserStories] = useState('')
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState('')
  const [productRequirements, setProductRequirements] = useState('')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')

  // Section collapse state (all collapsed by default)
  const [expandedSections, setExpandedSections] = useState({
    technicalArchitecture: false,
    productRequirements: false,
    businessRules: false,
    additionalRequirements: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Get compatible options based on selected backend framework
  const getCompatibleOptions = (category) => {
    const selectedFramework = backendFramework || customBackend
    if (!selectedFramework || !FRAMEWORK_COMPATIBILITY[selectedFramework]) {
      // Return all options if no framework selected or framework not in mapping
      return null
    }
    return FRAMEWORK_COMPATIBILITY[selectedFramework][category] || null
  }

  // Filter options based on compatibility
  const getFilteredOptions = (allOptions, category) => {
    const compatible = getCompatibleOptions(category)
    if (!compatible) return allOptions
    return allOptions.filter(option => compatible.includes(option))
  }

  // Generate the prompt
  const autoGeneratedPrompt = useMemo(() => {
    const sections = []
    
    // Technical Architecture Section
    const techArch = []
    
    if (frontendFramework || customFrontend) {
      techArch.push(`Frontend Framework: ${frontendFramework || customFrontend}`)
    }
    
    if (backendFramework || customBackend) {
      techArch.push(`Backend Framework: ${backendFramework || customBackend}`)
    }
    
    if (database || customDatabase) {
      techArch.push(`Database: ${database || customDatabase}`)
    }
    
    if (databaseMigrations || customDatabaseMigrations) {
      techArch.push(`Database Migrations: ${databaseMigrations || customDatabaseMigrations}`)
    }
    
    if (messaging || customMessaging) {
      techArch.push(`Messaging: ${messaging || customMessaging}`)
    }
    
    if (cachingStrategy.length > 0 || customCachingStrategy) {
      const cachingList = [...cachingStrategy]
      if (customCachingStrategy) cachingList.push(customCachingStrategy)
      techArch.push(`Caching Strategy: ${cachingList.join(', ')}`)
    }
    
    if (apiGateway || customApiGateway) {
      techArch.push(`API Gateway: ${apiGateway || customApiGateway}`)
    }
    
    if (apiContracts || customApiContracts) {
      techArch.push(`API & Contracts: ${apiContracts || customApiContracts}`)
    }
    
    if (testingFramework || customTesting) {
      techArch.push(`Testing Framework: ${testingFramework || customTesting}`)
    }
    
    if (apiTesting || customApiTesting || apiTestingOptions.length > 0 || customApiTestingOptions) {
      const apiTestingParts = []
      if (apiTesting || customApiTesting) {
        apiTestingParts.push(apiTesting || customApiTesting)
      }
      if (apiTestingOptions.length > 0 || customApiTestingOptions) {
        const optionsList = [...apiTestingOptions]
        if (customApiTestingOptions) optionsList.push(customApiTestingOptions)
        apiTestingParts.push(...optionsList)
      }
      if (apiTestingParts.length > 0) {
        techArch.push(`API Testing: ${apiTestingParts.join(', ')}`)
      }
    }
    
    if (aiFramework || customAiFramework || aiFrameworkOptions.length > 0 || customAiFrameworkOptions) {
      const aiFrameworkParts = []
      if (aiFramework || customAiFramework) {
        aiFrameworkParts.push(aiFramework || customAiFramework)
      }
      if (aiFrameworkOptions.length > 0 || customAiFrameworkOptions) {
        const optionsList = [...aiFrameworkOptions]
        if (customAiFrameworkOptions) optionsList.push(customAiFrameworkOptions)
        aiFrameworkParts.push(...optionsList)
      }
      if (aiFrameworkParts.length > 0) {
        techArch.push(`AI Framework: ${aiFrameworkParts.join(', ')}`)
      }
    }
    
    if (vectorDatabase || customVectorDatabase) {
      techArch.push(`Vector Database: ${vectorDatabase || customVectorDatabase}`)
    }
    
    if (aiTesting || customAiTesting || aiTestingOptions.length > 0 || customAiTestingOptions) {
      const aiTestingParts = []
      if (aiTesting || customAiTesting) {
        aiTestingParts.push(aiTesting || customAiTesting)
      }
      if (aiTestingOptions.length > 0 || customAiTestingOptions) {
        const optionsList = [...aiTestingOptions]
        if (customAiTestingOptions) optionsList.push(customAiTestingOptions)
        aiTestingParts.push(...optionsList)
      }
      if (aiTestingParts.length > 0) {
        techArch.push(`AI Testing: ${aiTestingParts.join(', ')}`)
      }
    }
    
    if (dockerEnv.length > 0 || customDockerEnv) {
      const dockerList = [...dockerEnv]
      if (customDockerEnv) dockerList.push(customDockerEnv)
      techArch.push(`Docker and Environment: ${dockerList.join(', ')}`)
    }
    
    if (observability || customObservability || observabilityOptions.length > 0 || customObservabilityOptions) {
      const observabilityParts = []
      if (observability || customObservability) {
        observabilityParts.push(observability || customObservability)
      }
      if (observabilityOptions.length > 0 || customObservabilityOptions) {
        const optionsList = [...observabilityOptions]
        if (customObservabilityOptions) optionsList.push(customObservabilityOptions)
        observabilityParts.push(...optionsList)
      }
      if (observabilityParts.length > 0) {
        techArch.push(`Observability: ${observabilityParts.join(', ')}`)
      }
    }
    
    if (securityDefaults.length > 0 || customSecurity) {
      const securityList = [...securityDefaults]
      if (customSecurity) securityList.push(customSecurity)
      techArch.push(`Security Defaults: ${securityList.join(', ')}`)
    }
    
    if (failureFirst.length > 0 || customFailureFirst) {
      const failureList = [...failureFirst]
      if (customFailureFirst) failureList.push(customFailureFirst)
      techArch.push(`Failure First Thinking: ${failureList.join(', ')}`)
    }
    
    if (testingPhilosophy.length > 0 || customTestingPhilosophy) {
      const testingList = [...testingPhilosophy]
      if (customTestingPhilosophy) testingList.push(customTestingPhilosophy)
      techArch.push(`Testing Philosophy: ${testingList.join(', ')}`)
    }
    
    if (modelValidation || customModelValidation) {
      techArch.push(`Model Validation: ${modelValidation || customModelValidation}`)
    }
    
    if (techArch.length > 0) {
      sections.push('## Technical Architecture\n' + techArch.join('\n'))
    }
    
    // Product Requirements Section
    if (productRequirements.trim()) {
      sections.push('## Product Requirements\n' + productRequirements.trim())
    }
    
    // Acceptance Criteria Section
    if (acceptanceCriteria.trim()) {
      sections.push('## Acceptance Criteria\n' + acceptanceCriteria.trim())
    }
    
    // User Stories Section
    if (userStories.trim()) {
      sections.push('## User Stories\n' + userStories.trim())
    }
    
    // Business Rules Section
    if (businessRules.trim()) {
      sections.push('## Business Rules\n' + businessRules.trim())
    }
    
    // Non-Functional Requirements Section
    if (nonFunctionalRequirements.trim()) {
      sections.push('## Non-Functional Requirements\n' + nonFunctionalRequirements.trim())
    }
    
    // Additional Requirements Section
    if (additionalRequirements.trim()) {
      sections.push('## Additional Requirements\n' + additionalRequirements.trim())
    }
    
    return sections.length > 0 ? sections.join('\n\n') : 'No requirements specified yet. Fill in the form to generate a prompt.'
  }, [
    frontendFramework, customFrontend,
    backendFramework, customBackend,
    database, customDatabase,
    databaseMigrations, customDatabaseMigrations,
    messaging, customMessaging,
    cachingStrategy, customCachingStrategy,
    apiGateway, customApiGateway,
    apiContracts, customApiContracts,
    testingFramework, customTesting,
    apiTesting, customApiTesting, apiTestingOptions, customApiTestingOptions,
    aiFramework, customAiFramework, aiFrameworkOptions, customAiFrameworkOptions,
    vectorDatabase, customVectorDatabase,
    aiTesting, customAiTesting, aiTestingOptions, customAiTestingOptions,
    dockerEnv, customDockerEnv,
    observability, customObservability, observabilityOptions, customObservabilityOptions,
    securityDefaults, customSecurity,
    failureFirst, customFailureFirst,
    testingPhilosophy, customTestingPhilosophy,
    modelValidation, customModelValidation,
    businessRules,
    userStories,
    productRequirements,
    acceptanceCriteria,
    nonFunctionalRequirements,
    additionalRequirements
  ])

  // Use edited prompt if available, otherwise use auto-generated
  const displayPrompt = isEditing && editedPrompt ? editedPrompt : autoGeneratedPrompt

  // Initialize edited prompt on first load
  useEffect(() => {
    if (!editedPrompt && autoGeneratedPrompt && !lastAutoGenerated) {
      setEditedPrompt(autoGeneratedPrompt)
      setLastAutoGenerated(autoGeneratedPrompt)
    }
  }, [autoGeneratedPrompt, editedPrompt, lastAutoGenerated])

  // Helper function to merge new auto-generated content into existing prompt
  const mergeAutoGeneratedContent = (existingPrompt, newAutoGenerated, previousAutoGenerated) => {
      if (!newAutoGenerated || newAutoGenerated === 'No requirements specified yet. Fill in the form to generate a prompt.') {
        // If new is empty, remove items that were in previous auto-generated
        if (previousAutoGenerated && previousAutoGenerated !== 'No requirements specified yet. Fill in the form to generate a prompt.') {
          return removeAutoGeneratedItems(existingPrompt, previousAutoGenerated, newAutoGenerated)
        }
        return existingPrompt
      }

      // If existing prompt is empty or just the default message, return new content
      if (!existingPrompt || existingPrompt === 'No requirements specified yet. Fill in the form to generate a prompt.') {
        return newAutoGenerated
      }

      // Parse the new auto-generated content into sections
      const newSections = newAutoGenerated.split(/\n\n(?=## )/g)
      const newSectionMap = new Map()
      
      newSections.forEach(section => {
        const lines = section.split('\n')
        const header = lines[0]?.trim() // e.g., "## Technical Architecture"
        if (header && header.startsWith('##')) {
          const content = lines.slice(1).join('\n').trim()
          newSectionMap.set(header, content)
        }
      })

      // Parse existing prompt into sections
      const existingSections = existingPrompt.split(/\n\n(?=## )/g)
      const mergedSections = []
      const processedHeaders = new Set()
      let hasNonSectionContent = false

      // First, process existing sections and merge with new content
      existingSections.forEach(section => {
        const lines = section.split('\n')
        const header = lines[0]?.trim()
        
        if (header && header.startsWith('##')) {
          processedHeaders.add(header)
          
          if (newSectionMap.has(header)) {
            // Merge content: combine existing items with new items, avoiding duplicates
            const existingContent = lines.slice(1).join('\n').trim()
            const newContent = newSectionMap.get(header)
            
            // Extract individual items (lines) - preserve ALL existing lines including custom text
            const existingItems = existingContent ? existingContent.split('\n').map(line => line.trim()).filter(line => line) : []
            const newItems = newContent ? newContent.split('\n').map(line => line.trim()).filter(line => line) : []
            
            // Create a map to track auto-generated items by their key (e.g., "Frontend Framework:")
            // Also keep track of custom items that don't match the pattern
            const existingItemMap = new Map()
            const customItems = [] // Items that don't match auto-generated pattern
            
            existingItems.forEach(item => {
              // Extract key (e.g., "Frontend Framework:" from "Frontend Framework: React")
              const key = item.split(':')[0]?.trim()
              // Check if this looks like an auto-generated item (has a colon and matches known patterns)
              const isAutoGenerated = key && (
                item.includes('Framework:') ||
                item.includes('Database:') ||
                item.includes('Database Migrations:') ||
                item.includes('Vector Database:') ||
                item.includes('Messaging:') ||
                item.includes('Caching Strategy:') ||
                item.includes('Gateway:') ||
                item.includes('Contracts:') ||
                item.includes('Testing:') ||
                item.includes('Environment:') ||
                item.includes('Observability:') ||
                item.includes('Security Defaults:') ||
                item.includes('Failure First Thinking:') ||
                item.includes('Testing Philosophy:') ||
                item.includes('Model Validation:')
              )
              
              if (isAutoGenerated && key) {
                existingItemMap.set(key, item)
              } else {
                // This is custom text, preserve it
                customItems.push(item)
              }
            })
            
            // Get keys of new items to identify what should remain
            const newItemKeys = new Set(newItems.map(item => {
              const key = item.split(':')[0]?.trim()
              return key || item
            }).filter(Boolean))
            
            // Remove items from existing that are not in new (if they were auto-generated)
            const itemsToRemove = new Set()
            existingItemMap.forEach((value, key) => {
              if (!newItemKeys.has(key)) {
                itemsToRemove.add(key)
              }
            })
            itemsToRemove.forEach(key => existingItemMap.delete(key))
            
            // Add new auto-generated items that don't already exist (by key)
            newItems.forEach(item => {
              const key = item.split(':')[0]?.trim()
              const itemKey = key || item
              if (existingItemMap.has(itemKey)) {
                // Check if existing item is a manually edited version (longer or contains the auto-generated value)
                const existingItem = existingItemMap.get(itemKey)
                const autoGeneratedValue = item.split(':').slice(1).join(':').trim()
                const existingValue = existingItem.split(':').slice(1).join(':').trim()
                
                // If existing item contains the auto-generated value or is longer, preserve it
                // This means user manually edited it (e.g., "React with TypeScript" vs "React")
                if (existingValue.includes(autoGeneratedValue) || existingValue.length > autoGeneratedValue.length) {
                  // Keep the existing (manually edited) version
                  // Don't update it
                } else if (existingItem !== item && key) {
                  // Only replace if the new value is different and existing is not a superset
                  existingItemMap.set(itemKey, item)
                }
              } else if (key) {
                // New auto-generated item
                existingItemMap.set(itemKey, item)
              } else {
                // Doesn't match pattern, treat as custom
                if (!customItems.includes(item)) {
                  customItems.push(item)
                }
              }
            })
            
            // Reconstruct the section: auto-generated items first, then custom items
            const autoGeneratedContent = Array.from(existingItemMap.values()).join('\n')
            const allContent = [autoGeneratedContent, ...customItems].filter(Boolean).join('\n')
            mergedSections.push(header + '\n' + allContent)
          } else {
            // Keep existing section as-is (user's custom section)
            mergedSections.push(section)
          }
        } else {
          // Non-section content (like user's custom text at the top)
          if (section.trim()) {
            hasNonSectionContent = true
            mergedSections.push(section)
          }
        }
      })

      // Add any new sections that didn't exist before
      newSectionMap.forEach((content, header) => {
        if (!processedHeaders.has(header)) {
          mergedSections.push(header + '\n' + content)
        }
      })

      return mergedSections.join('\n\n')
    }

  // Helper function to remove items that were in previous auto-generated but not in new
  const removeAutoGeneratedItems = (existingPrompt, previousAutoGenerated, newAutoGenerated) => {
    // Parse previous auto-generated to get list of items
    const prevSections = previousAutoGenerated.split(/\n\n(?=## )/g)
    const prevItemKeys = new Set()
    
    prevSections.forEach(section => {
      const lines = section.split('\n')
      const header = lines[0]?.trim()
      if (header && header.startsWith('##')) {
        const items = lines.slice(1).join('\n').trim().split('\n')
        items.forEach(item => {
          const key = item.split(':')[0]?.trim()
          if (key) {
            prevItemKeys.add(key)
          }
        })
      }
    })

    // Parse new auto-generated to see what should remain
    const newItemKeys = new Set()
    if (newAutoGenerated && newAutoGenerated !== 'No requirements specified yet. Fill in the form to generate a prompt.') {
      const newSections = newAutoGenerated.split(/\n\n(?=## )/g)
      newSections.forEach(section => {
        const lines = section.split('\n')
        const header = lines[0]?.trim()
        if (header && header.startsWith('##')) {
          const items = lines.slice(1).join('\n').trim().split('\n')
          items.forEach(item => {
            const key = item.split(':')[0]?.trim()
            if (key) {
              newItemKeys.add(key)
            }
          })
        }
      })
    }

    // Find items to remove (in previous but not in new)
    const itemsToRemove = new Set()
    prevItemKeys.forEach(key => {
      if (!newItemKeys.has(key)) {
        itemsToRemove.add(key)
      }
    })

    if (itemsToRemove.size === 0) {
      return existingPrompt
    }

    // Remove items from existing prompt
    const existingSections = existingPrompt.split(/\n\n(?=## )/g)
    const cleanedSections = []

    existingSections.forEach(section => {
      const lines = section.split('\n')
      const header = lines[0]?.trim()
      
      if (header && header.startsWith('##')) {
        const existingContent = lines.slice(1).join('\n').trim()
        const existingItems = existingContent ? existingContent.split('\n').map(line => line.trim()).filter(line => line) : []
        
        const filteredItems = existingItems.filter(item => {
          const key = item.split(':')[0]?.trim()
          const isAutoGenerated = key && (
            item.includes('Framework:') ||
            item.includes('Gateway:') ||
            item.includes('Contracts:') ||
            item.includes('Testing:') ||
            item.includes('Environment:') ||
            item.includes('Observability:') ||
            item.includes('Security Defaults:') ||
            item.includes('Failure First Thinking:') ||
            item.includes('Testing Philosophy:') ||
            item.includes('Model Validation:')
          )
          
          // Remove if it's an auto-generated item that should be removed
          if (isAutoGenerated && key && itemsToRemove.has(key)) {
            return false
          }
          // Keep everything else (custom items, other auto-generated items)
          return true
        })
        
        if (filteredItems.length > 0) {
          cleanedSections.push(header + '\n' + filteredItems.join('\n'))
        }
      } else {
        // Keep non-section content
        if (section.trim()) {
          cleanedSections.push(section)
        }
      }
    })

    return cleanedSections.join('\n\n')
  }

  // When auto-generated prompt changes, merge it intelligently if in edit mode
  useEffect(() => {
    if (autoGeneratedPrompt !== lastAutoGenerated) {
      if (isEditing && lastAutoGenerated !== '') {
        // In edit mode, merge new auto-generated content intelligently
        // Pass previous auto-generated to detect removals
        setEditedPrompt(prev => mergeAutoGeneratedContent(prev, autoGeneratedPrompt, lastAutoGenerated))
      } else {
        // In view mode or first load, just update the edited prompt
        setEditedPrompt(autoGeneratedPrompt)
      }
      setLastAutoGenerated(autoGeneratedPrompt)
    }
  }, [autoGeneratedPrompt, isEditing, lastAutoGenerated])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handlePromptChange = (e) => {
    setEditedPrompt(e.target.value)
    setIsEditing(true)
  }

  const handleResetToAuto = () => {
    // Reset to just the auto-generated prompt (remove any user edits)
    setEditedPrompt(autoGeneratedPrompt)
    setLastAutoGenerated(autoGeneratedPrompt)
  }

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false)
      setEditedPrompt(autoGeneratedPrompt)
    } else {
      setIsEditing(true)
      if (!editedPrompt || editedPrompt === autoGeneratedPrompt) {
        setEditedPrompt(autoGeneratedPrompt)
      }
    }
  }

  const toggleSecurityDefault = (item) => {
    setSecurityDefaults(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleFailureFirst = (item) => {
    setFailureFirst(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleDockerEnv = (item) => {
    setDockerEnv(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleCachingStrategy = (item) => {
    setCachingStrategy(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleObservabilityOptions = (item) => {
    setObservabilityOptions(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleAiTestingOptions = (item) => {
    setAiTestingOptions(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleAiFrameworkOptions = (item) => {
    setAiFrameworkOptions(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleApiTestingOptions = (item) => {
    setApiTestingOptions(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleTestingPhilosophy = (item) => {
    setTestingPhilosophy(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  return (
    <div className="requirements-constructor">
      <div className="requirements-layout">
        {/* Left Panel - Constructor */}
        <div className="requirements-left-panel">
          <div className="requirements-header">
            <button className="btn-back" onClick={onNavigateBack} title="Back to Prompts">
              <ChevronLeft size={20} />
            </button>
            <div className="requirements-header-content">
              <div className="requirements-header-icon">
                <Code size={24} strokeWidth={1.5} />
              </div>
              <h1>Requirements Constructor</h1>
              <p>Build comprehensive requirements for AI-powered web applications</p>
            </div>
          </div>

          <div className="requirements-form">
            {/* Technical Architecture Section */}
            <section className="requirements-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('technicalArchitecture')}
                style={{ cursor: 'pointer' }}
              >
                <Settings size={18} />
                <h2>Technical Architecture</h2>
                {expandedSections.technicalArchitecture ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>

              {expandedSections.technicalArchitecture && (
                <>
              <div className="form-group">
                <label>Frontend Framework</label>
                <div className="dropdown-with-custom">
                  <select
                    value={frontendFramework}
                    onChange={(e) => {
                      setFrontendFramework(e.target.value)
                      if (e.target.value) setCustomFrontend('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {FRONTEND_FRAMEWORKS.map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                  {frontendFramework && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setFrontendFramework('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom framework..."
                  value={customFrontend}
                  onChange={(e) => {
                    setCustomFrontend(e.target.value)
                    if (e.target.value) setFrontendFramework('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Backend Framework</label>
                <div className="dropdown-with-custom">
                  <select
                    value={backendFramework}
                    onChange={(e) => {
                      setBackendFramework(e.target.value)
                      if (e.target.value) setCustomBackend('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {BACKEND_FRAMEWORKS.map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                  {backendFramework && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setBackendFramework('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom framework..."
                  value={customBackend}
                  onChange={(e) => {
                    setCustomBackend(e.target.value)
                    if (e.target.value) setBackendFramework('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Database</label>
                <div className="dropdown-with-custom">
                  <select
                    value={database}
                    onChange={(e) => {
                      setDatabase(e.target.value)
                      if (e.target.value) setCustomDatabase('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(DATABASES, 'databases').map(db => (
                      <option key={db} value={db}>{db}</option>
                    ))}
                  </select>
                  {database && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setDatabase('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom database..."
                  value={customDatabase}
                  onChange={(e) => {
                    setCustomDatabase(e.target.value)
                    if (e.target.value) setDatabase('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Model Validation</label>
                <div className="dropdown-with-custom">
                  <select
                    value={modelValidation}
                    onChange={(e) => {
                      setModelValidation(e.target.value)
                      if (e.target.value) setCustomModelValidation('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {VALIDATION_LIBRARIES.map(lib => (
                      <option key={lib} value={lib}>{lib}</option>
                    ))}
                  </select>
                  {modelValidation && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setModelValidation('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom validation library..."
                  value={customModelValidation}
                  onChange={(e) => {
                    setCustomModelValidation(e.target.value)
                    if (e.target.value) setModelValidation('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Database Migrations</label>
                <div className="dropdown-with-custom">
                  <select
                    value={databaseMigrations}
                    onChange={(e) => {
                      setDatabaseMigrations(e.target.value)
                      if (e.target.value) setCustomDatabaseMigrations('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(DATABASE_MIGRATIONS, 'migrations').map(migration => (
                      <option key={migration} value={migration}>{migration}</option>
                    ))}
                  </select>
                  {databaseMigrations && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setDatabaseMigrations('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom migration tool..."
                  value={customDatabaseMigrations}
                  onChange={(e) => {
                    setCustomDatabaseMigrations(e.target.value)
                    if (e.target.value) setDatabaseMigrations('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Messaging</label>
                <div className="dropdown-with-custom">
                  <select
                    value={messaging}
                    onChange={(e) => {
                      setMessaging(e.target.value)
                      if (e.target.value) setCustomMessaging('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(MESSAGING_SYSTEMS, 'messaging').map(msg => (
                      <option key={msg} value={msg}>{msg}</option>
                    ))}
                  </select>
                  {messaging && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setMessaging('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom messaging system..."
                  value={customMessaging}
                  onChange={(e) => {
                    setCustomMessaging(e.target.value)
                    if (e.target.value) setMessaging('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Caching Strategy</label>
                <div className="multi-select-container">
                  {getFilteredOptions(CACHING_STRATEGIES, 'caching').map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${cachingStrategy.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleCachingStrategy(item)}
                    >
                      {item}
                      {cachingStrategy.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom caching strategy..."
                  value={customCachingStrategy}
                  onChange={(e) => setCustomCachingStrategy(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>API Gateway</label>
                <div className="dropdown-with-custom">
                  <select
                    value={apiGateway}
                    onChange={(e) => {
                      setApiGateway(e.target.value)
                      if (e.target.value) setCustomApiGateway('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(API_GATEWAYS, 'apiGateways').map(gw => (
                      <option key={gw} value={gw}>{gw}</option>
                    ))}
                  </select>
                  {apiGateway && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setApiGateway('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom API gateway..."
                  value={customApiGateway}
                  onChange={(e) => {
                    setCustomApiGateway(e.target.value)
                    if (e.target.value) setApiGateway('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>API & Contracts</label>
                <div className="dropdown-with-custom">
                  <select
                    value={apiContracts}
                    onChange={(e) => {
                      setApiContracts(e.target.value)
                      if (e.target.value) setCustomApiContracts('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {API_CONTRACTS.map(contract => (
                      <option key={contract} value={contract}>{contract}</option>
                    ))}
                  </select>
                  {apiContracts && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setApiContracts('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom API contract..."
                  value={customApiContracts}
                  onChange={(e) => {
                    setCustomApiContracts(e.target.value)
                    if (e.target.value) setApiContracts('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Testing Framework</label>
                <div className="dropdown-with-custom">
                  <select
                    value={testingFramework}
                    onChange={(e) => {
                      setTestingFramework(e.target.value)
                      if (e.target.value) setCustomTesting('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(TESTING_FRAMEWORKS, 'testing').map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                  {testingFramework && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setTestingFramework('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom testing framework..."
                  value={customTesting}
                  onChange={(e) => {
                    setCustomTesting(e.target.value)
                    if (e.target.value) setTestingFramework('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>API Testing</label>
                <div className="dropdown-with-custom">
                  <select
                    value={apiTesting}
                    onChange={(e) => {
                      setApiTesting(e.target.value)
                      if (e.target.value) setCustomApiTesting('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {getFilteredOptions(API_TESTING_TOOLS, 'apiTesting').map(tool => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                  {apiTesting && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setApiTesting('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom API testing tool..."
                  value={customApiTesting}
                  onChange={(e) => {
                    setCustomApiTesting(e.target.value)
                    if (e.target.value) setApiTesting('')
                  }}
                  className="form-input"
                />
                <div className="multi-select-container" style={{ marginTop: '8px' }}>
                  {API_TESTING_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${apiTestingOptions.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleApiTestingOptions(item)}
                    >
                      {item}
                      {apiTestingOptions.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom API testing requirement..."
                  value={customApiTestingOptions}
                  onChange={(e) => setCustomApiTestingOptions(e.target.value)}
                  className="form-input"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>AI Framework</label>
                <div className="dropdown-with-custom">
                  <select
                    value={aiFramework}
                    onChange={(e) => {
                      setAiFramework(e.target.value)
                      if (e.target.value) setCustomAiFramework('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {AI_FRAMEWORKS.map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                  {aiFramework && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setAiFramework('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom AI framework..."
                  value={customAiFramework}
                  onChange={(e) => {
                    setCustomAiFramework(e.target.value)
                    if (e.target.value) setAiFramework('')
                  }}
                  className="form-input"
                />
                <div className="multi-select-container" style={{ marginTop: '8px' }}>
                  {AI_FRAMEWORK_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${aiFrameworkOptions.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleAiFrameworkOptions(item)}
                    >
                      {item}
                      {aiFrameworkOptions.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom AI framework requirement..."
                  value={customAiFrameworkOptions}
                  onChange={(e) => setCustomAiFrameworkOptions(e.target.value)}
                  className="form-input"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>Vector Database</label>
                <div className="dropdown-with-custom">
                  <select
                    value={vectorDatabase}
                    onChange={(e) => {
                      setVectorDatabase(e.target.value)
                      if (e.target.value) setCustomVectorDatabase('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {VECTOR_DATABASES.map(vdb => (
                      <option key={vdb} value={vdb}>{vdb}</option>
                    ))}
                  </select>
                  {vectorDatabase && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setVectorDatabase('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom vector database..."
                  value={customVectorDatabase}
                  onChange={(e) => {
                    setCustomVectorDatabase(e.target.value)
                    if (e.target.value) setVectorDatabase('')
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>AI Testing</label>
                <div className="dropdown-with-custom">
                  <select
                    value={aiTesting}
                    onChange={(e) => {
                      setAiTesting(e.target.value)
                      if (e.target.value) setCustomAiTesting('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {AI_TESTING_TOOLS.map(tool => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                  {aiTesting && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setAiTesting('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom AI testing tool..."
                  value={customAiTesting}
                  onChange={(e) => {
                    setCustomAiTesting(e.target.value)
                    if (e.target.value) setAiTesting('')
                  }}
                  className="form-input"
                />
                <div className="multi-select-container" style={{ marginTop: '8px' }}>
                  {AI_TESTING_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${aiTestingOptions.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleAiTestingOptions(item)}
                    >
                      {item}
                      {aiTestingOptions.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom AI testing requirement..."
                  value={customAiTestingOptions}
                  onChange={(e) => setCustomAiTestingOptions(e.target.value)}
                  className="form-input"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>Docker and Environment</label>
                <div className="multi-select-container">
                  {DOCKER_ENV_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${dockerEnv.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleDockerEnv(item)}
                    >
                      {item}
                      {dockerEnv.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom Docker/environment requirement..."
                  value={customDockerEnv}
                  onChange={(e) => setCustomDockerEnv(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Observability</label>
                <div className="dropdown-with-custom">
                  <select
                    value={observability}
                    onChange={(e) => {
                      setObservability(e.target.value)
                      if (e.target.value) setCustomObservability('')
                    }}
                    className="form-select"
                  >
                    <option value="">Select or add custom...</option>
                    {OBSERVABILITY_TOOLS.map(tool => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                  {observability && (
                    <button
                      type="button"
                      className="btn-clear-select"
                      onClick={() => setObservability('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom observability tool..."
                  value={customObservability}
                  onChange={(e) => {
                    setCustomObservability(e.target.value)
                    if (e.target.value) setObservability('')
                  }}
                  className="form-input"
                />
                <div className="multi-select-container" style={{ marginTop: '8px' }}>
                  {OBSERVABILITY_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${observabilityOptions.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleObservabilityOptions(item)}
                    >
                      {item}
                      {observabilityOptions.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom observability requirement..."
                  value={customObservabilityOptions}
                  onChange={(e) => setCustomObservabilityOptions(e.target.value)}
                  className="form-input"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>Security Defaults</label>
                <div className="multi-select-container">
                  {SECURITY_DEFAULTS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${securityDefaults.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleSecurityDefault(item)}
                    >
                      {item}
                      {securityDefaults.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom security requirement..."
                  value={customSecurity}
                  onChange={(e) => setCustomSecurity(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Failure First Thinking</label>
                <div className="multi-select-container">
                  {FAILURE_FIRST_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${failureFirst.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFailureFirst(item)}
                    >
                      {item}
                      {failureFirst.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom failure handling approach..."
                  value={customFailureFirst}
                  onChange={(e) => setCustomFailureFirst(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Testing Philosophy</label>
                <div className="multi-select-container">
                  {TESTING_PHILOSOPHY_OPTIONS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`multi-select-chip ${testingPhilosophy.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleTestingPhilosophy(item)}
                    >
                      {item}
                      {testingPhilosophy.includes(item) && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or add custom testing philosophy requirement..."
                  value={customTestingPhilosophy}
                  onChange={(e) => setCustomTestingPhilosophy(e.target.value)}
                  className="form-input"
                />
              </div>
                </>
              )}
            </section>

            {/* Product Requirements Section */}
            <section className="requirements-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('productRequirements')}
                style={{ cursor: 'pointer' }}
              >
                <FileText size={18} />
                <h2>Product Requirements</h2>
                {expandedSections.productRequirements ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
              
              {expandedSections.productRequirements && (
                <>
              <div className="form-group">
                <label>Product Requirements</label>
                <textarea
                  value={productRequirements}
                  onChange={(e) => setProductRequirements(e.target.value)}
                  placeholder="Define product features, functionality, and capabilities..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Acceptance Criteria</label>
                <textarea
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="Define the conditions that must be met for a feature to be considered complete..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>User Stories</label>
                <textarea
                  value={userStories}
                  onChange={(e) => setUserStories(e.target.value)}
                  placeholder="As a [user type], I want [goal] so that [benefit]..."
                  className="form-textarea"
                  rows={4}
                />
              </div>
                </>
              )}
            </section>

            {/* Business Rules Section */}
            <section className="requirements-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('businessRules')}
                style={{ cursor: 'pointer' }}
              >
                <Building2 size={18} />
                <h2>Business Rules</h2>
                {expandedSections.businessRules ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
              {expandedSections.businessRules && (
                <div className="form-group">
                  <textarea
                    value={businessRules}
                    onChange={(e) => setBusinessRules(e.target.value)}
                    placeholder="Define business logic, validation rules, workflows..."
                    className="form-textarea"
                    rows={5}
                  />
                </div>
              )}
            </section>

            {/* Additional Sections */}
            <section className="requirements-section">
              <div 
                className="section-header clickable"
                onClick={() => toggleSection('additionalRequirements')}
                style={{ cursor: 'pointer' }}
              >
                <FileText size={18} />
                <h2>Additional Requirements</h2>
                {expandedSections.additionalRequirements ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
              
              {expandedSections.additionalRequirements && (
                <>
              <div className="form-group">
                <label>Non-Functional Requirements</label>
                <textarea
                  value={nonFunctionalRequirements}
                  onChange={(e) => setNonFunctionalRequirements(e.target.value)}
                  placeholder="Performance, scalability, availability, maintainability requirements..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Other Requirements</label>
                <textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Any other important requirements, constraints, or considerations..."
                  className="form-textarea"
                  rows={4}
                />
              </div>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="requirements-right-panel">
          <div className="preview-header">
            <div className="preview-header-content">
              <Sparkles size={20} />
              <h2>Generated Prompt</h2>
              {isEditing && (
                <span className="editing-badge">
                  <Pencil size={12} />
                  Editing
                </span>
              )}
            </div>
            <div className="preview-header-actions">
              {isEditing && (
                <button
                  className="btn-reset-prompt"
                  onClick={handleResetToAuto}
                  title="Reset to auto-generated"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
              <button
                className="btn-toggle-edit"
                onClick={handleToggleEdit}
                title={isEditing ? "View auto-generated" : "Edit prompt"}
              >
                {isEditing ? <Eye size={16} /> : <Pencil size={16} />}
                {isEditing ? 'View Auto' : 'Edit'}
              </button>
              <button
                className="btn-copy-prompt"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="preview-content">
            {isEditing ? (
              <textarea
                className="prompt-editor"
                value={editedPrompt}
                onChange={handlePromptChange}
                placeholder="Edit the prompt and add additional context..."
                spellCheck={false}
              />
            ) : (
              <pre className="prompt-preview">{displayPrompt}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequirementsConstructor

