// KPI Data Structure based on Excel file
const kpiData = {
    categories: [
        {
            id: 'requirements',
            name: 'Requirements Engineering & Breakdown',
            description: 'Evaluation of how well tools understand and decompose requirements',
            kpis: [
                {
                    id: 'req_interpretation',
                    name: 'Requirement Interpretation Accuracy',
                    description: 'How accurately the tool understands and interprets project requirements',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures clarity, completeness, and accuracy of requirement understanding'
                },
                {
                    id: 'story_decomposition',
                    name: 'Story/User Flow Decomposition',
                    description: 'Ability to break down complex user stories into manageable components',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates logical flow breakdown and traceability'
                },
                {
                    id: 'use_case_coverage',
                    name: 'Use Case Coverage',
                    description: 'Comprehensive coverage of different use cases and scenarios',
                    metricType: 'Percentage Coverage',
                    evaluationCriteria: 'Measures completeness of use case identification and handling'
                },
                {
                    id: 'acceptance_criteria',
                    name: 'Acceptance Criteria Definition',
                    description: 'Quality of acceptance criteria generation and definition',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses clarity, testability, and completeness of acceptance criteria'
                },
                {
                    id: 'functional_separation',
                    name: 'Functional/Non-functional Separation',
                    description: 'Ability to distinguish between functional and non-functional requirements',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Evaluates proper categorization and handling of different requirement types'
                },
                {
                    id: 'traceability_support',
                    name: 'Traceability Matrix Support',
                    description: 'Support for maintaining requirement traceability throughout development',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Measures ability to link requirements to implementation and tests'
                }
            ]
        },
        {
            id: 'architecture',
            name: 'Architecture & Technical Design',
            description: 'Assessment of architectural design capabilities and technical recommendations',
            kpis: [
                {
                    id: 'architecture_validity',
                    name: 'Architecture Proposal Validity',
                    description: 'Quality and appropriateness of architectural recommendations',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates technical soundness and contextual appropriateness'
                },
                {
                    id: 'design_patterns',
                    name: 'Use of Design Patterns',
                    description: 'Appropriate application of established design patterns',
                    metricType: 'Count/Score',
                    evaluationCriteria: 'Measures correct usage and variety of design patterns applied'
                },
                {
                    id: 'solid_compliance',
                    name: 'SOLID/DRY/KISS Compliance',
                    description: 'Adherence to fundamental software design principles',
                    metricType: 'Percentage Adherence',
                    evaluationCriteria: 'Assesses compliance with core software engineering principles'
                },
                {
                    id: 'modularity',
                    name: 'Modularity & Separation of Concerns',
                    description: 'Quality of code organization and separation of concerns',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates code organization and component separation'
                },
                {
                    id: 'tech_stack_fit',
                    name: 'Tech Stack Recommendation Fit',
                    description: 'Appropriateness of technology stack recommendations',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures alignment with project requirements and industry standards'
                },
                {
                    id: 'extensibility',
                    name: 'Extensibility/Refactorability Score',
                    description: 'How well the generated code supports future changes and extensions',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses code flexibility and maintainability'
                }
            ]
        },
        {
            id: 'toolchain',
            name: 'Toolchain Integration & MCPS',
            description: 'Integration capabilities with development tools and platforms',
            kpis: [
                {
                    id: 'modeling_compatibility',
                    name: 'Modeling Tool Compatibility',
                    description: 'Compatibility with modeling and diagramming tools',
                    metricType: 'Count of Supported Tools',
                    evaluationCriteria: 'Measures integration with UML, draw.io, PlantUML, etc.'
                },
                {
                    id: 'mcps_integration',
                    name: 'Integration with MCPS',
                    description: 'Integration with communication and project management platforms',
                    metricType: 'Count of Integrations',
                    evaluationCriteria: 'Evaluates connectivity with Slack, Jira, Notion, etc.'
                },
                {
                    id: 'git_workflow',
                    name: 'Git Workflow Generation',
                    description: 'Ability to generate appropriate Git workflows and branching strategies',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Assesses Git workflow setup and branching strategy recommendations'
                },
                {
                    id: 'cicd_setup',
                    name: 'CI/CD Pipeline Setup',
                    description: 'Automated setup of continuous integration and deployment pipelines',
                    metricType: 'Percentage Automation',
                    evaluationCriteria: 'Measures completeness of CI/CD pipeline generation'
                },
                {
                    id: 'container_iac',
                    name: 'Docker/K8s/IaC File Generation',
                    description: 'Generation of containerization and infrastructure as code files',
                    metricType: 'Percentage Correctness',
                    evaluationCriteria: 'Evaluates quality of Docker, Kubernetes, and IaC file generation'
                },
                {
                    id: 'iac_support',
                    name: 'IaC Tool Support',
                    description: 'Support for Infrastructure as Code tools',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Measures support for Terraform, Pulumi, CloudFormation, etc.'
                },
                {
                    id: 'env_segregation',
                    name: 'Environment Segregation',
                    description: 'Support for multiple environment configurations',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Evaluates dev/staging/production environment handling'
                }
            ]
        },
        {
            id: 'testing',
            name: 'Testing & Validation',
            description: 'Testing strategy and test generation capabilities',
            kpis: [
                {
                    id: 'unit_test_coverage',
                    name: 'Unit Test Coverage',
                    description: 'Percentage of code covered by automatically generated unit tests',
                    metricType: 'Percentage Coverage',
                    evaluationCriteria: 'Measures comprehensiveness of unit test generation'
                },
                {
                    id: 'test_assertion_relevance',
                    name: 'Test Assertion Relevance',
                    description: 'Quality and relevance of test assertions and validations',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses meaningfulness and effectiveness of test assertions'
                },
                {
                    id: 'edge_case_testing',
                    name: 'Edge Case & Negative Flow Inclusion',
                    description: 'Coverage of edge cases and negative testing scenarios',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates completeness of edge case and error scenario testing'
                },
                {
                    id: 'test_pyramid',
                    name: 'Test Pyramid Compliance',
                    description: 'Adherence to testing pyramid principles (unit > integration > e2e)',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Measures balanced distribution of test types'
                },
                {
                    id: 'tdd_bdd_support',
                    name: 'TDD/BDD Compatibility',
                    description: 'Support for Test-Driven and Behavior-Driven Development',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Assesses compatibility with TDD and BDD methodologies'
                },
                {
                    id: 'coverage_gap_detection',
                    name: 'Coverage Gap Detection & Fix',
                    description: 'Ability to identify and address testing gaps',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates gap identification and remediation capabilities'
                }
            ]
        },
        {
            id: 'documentation',
            name: 'Documentation & Commentary',
            description: 'Code documentation and commenting capabilities',
            kpis: [
                {
                    id: 'code_comments',
                    name: 'Code Comments Quality',
                    description: 'Quality and completeness of generated code comments',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures clarity, accuracy, and helpfulness of code comments'
                },
                {
                    id: 'api_documentation',
                    name: 'API Documentation Generation',
                    description: 'Automatic generation of API documentation',
                    metricType: 'Percentage Completeness',
                    evaluationCriteria: 'Evaluates completeness and accuracy of API documentation'
                },
                {
                    id: 'readme_generation',
                    name: 'README & Setup Guide Creation',
                    description: 'Quality of README files and setup instructions',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses clarity and completeness of project documentation'
                },
                {
                    id: 'inline_documentation',
                    name: 'Inline Documentation Standards',
                    description: 'Adherence to documentation standards and conventions',
                    metricType: 'Percentage Adherence',
                    evaluationCriteria: 'Measures compliance with documentation standards'
                },
                {
                    id: 'architectural_docs',
                    name: 'Architectural Documentation',
                    description: 'Generation of architectural and design documentation',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates quality of architectural documentation'
                }
            ]
        },
        {
            id: 'deployment',
            name: 'Deployment & Infrastructure Readiness',
            description: 'Deployment strategy and infrastructure preparation capabilities',
            kpis: [
                {
                    id: 'deployment_plan',
                    name: 'Deployment Plan Generation',
                    description: 'Quality of deployment strategy and execution plans',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses completeness and viability of deployment plans'
                },
                {
                    id: 'pipeline_validity',
                    name: 'CI/CD Pipeline Validity',
                    description: 'Technical correctness of generated CI/CD pipelines',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates pipeline functionality and best practices'
                },
                {
                    id: 'rollback_strategy',
                    name: 'Rollback/Fallback Strategy',
                    description: 'Inclusion of rollback and disaster recovery mechanisms',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Measures presence of rollback and recovery strategies'
                },
                {
                    id: 'platform_optimization',
                    name: 'Platform Fit Score',
                    description: 'Optimization for specific deployment platforms',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses platform-specific optimizations (AWS, GCP, Azure)'
                },
                {
                    id: 'observability_integration',
                    name: 'Observability Integration',
                    description: 'Integration with monitoring and observability tools',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Evaluates monitoring and logging setup'
                },
                {
                    id: 'monitoring_setup',
                    name: 'Monitoring & Alerting Setup',
                    description: 'Automated setup of monitoring and alerting systems',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Measures monitoring and alerting configuration'
                }
            ]
        },
        {
            id: 'delivery',
            name: 'Delivery, Maintenance & Ops',
            description: 'Operational readiness and maintenance capabilities',
            kpis: [
                {
                    id: 'ops_readiness',
                    name: 'Operational Readiness',
                    description: 'Preparation for production operations and maintenance',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses production readiness and operational considerations'
                },
                {
                    id: 'maintenance_docs',
                    name: 'Maintenance Documentation',
                    description: 'Quality of maintenance and operational documentation',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates completeness of maintenance guides and procedures'
                },
                {
                    id: 'troubleshooting_guides',
                    name: 'Troubleshooting Guide Generation',
                    description: 'Creation of troubleshooting and debugging guides',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures quality and usefulness of troubleshooting documentation'
                },
                {
                    id: 'performance_monitoring',
                    name: 'Performance Monitoring Setup',
                    description: 'Setup of performance monitoring and optimization tools',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Assesses performance monitoring implementation'
                },
                {
                    id: 'backup_recovery',
                    name: 'Backup & Recovery Procedures',
                    description: 'Implementation of backup and recovery strategies',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Evaluates backup and recovery solution setup'
                },
                {
                    id: 'scaling_strategy',
                    name: 'Scaling Strategy Planning',
                    description: 'Planning for horizontal and vertical scaling',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures scalability planning and implementation'
                }
            ]
        },
        {
            id: 'agent_intelligence',
            name: 'Agent Intelligence & Prompt Understanding',
            description: 'AI agent capabilities and prompt interpretation',
            kpis: [
                {
                    id: 'context_understanding',
                    name: 'Context Understanding',
                    description: 'Ability to understand and maintain context throughout conversations',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates context retention and understanding depth'
                },
                {
                    id: 'prompt_interpretation',
                    name: 'Prompt Interpretation Accuracy',
                    description: 'Accuracy in interpreting user prompts and intentions',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Measures interpretation accuracy and response relevance'
                },
                {
                    id: 'code_generation_quality',
                    name: 'Code Generation Quality',
                    description: 'Quality and correctness of generated code',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses code correctness, efficiency, and best practices'
                },
                {
                    id: 'learning_adaptation',
                    name: 'Learning & Adaptation',
                    description: 'Ability to learn from user feedback and adapt responses',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates learning capability and response improvement'
                },
                {
                    id: 'multi_language_support',
                    name: 'Multi-language Support',
                    description: 'Support for multiple programming languages and frameworks',
                    metricType: 'Count of Languages',
                    evaluationCriteria: 'Measures breadth and depth of language support'
                },
                {
                    id: 'domain_expertise',
                    name: 'Domain-specific Expertise',
                    description: 'Specialized knowledge in specific domains or industries',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses domain-specific knowledge and recommendations'
                }
            ]
        },
        {
            id: 'developer_experience',
            name: 'Developer Experience & Collaboration',
            description: 'User experience and team collaboration features',
            kpis: [
                {
                    id: 'user_interface_quality',
                    name: 'User Interface Quality',
                    description: 'Quality and usability of the user interface',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates UI/UX design and usability'
                },
                {
                    id: 'collaboration_features',
                    name: 'Collaboration Features',
                    description: 'Features supporting team collaboration and code sharing',
                    metricType: 'Count of Features',
                    evaluationCriteria: 'Measures collaboration tools and team features'
                },
                {
                    id: 'workflow_integration',
                    name: 'Workflow Integration',
                    description: 'Integration with existing development workflows',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses workflow compatibility and integration ease'
                },
                {
                    id: 'learning_curve',
                    name: 'Learning Curve',
                    description: 'Ease of learning and adoption for new users',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates onboarding ease and learning requirements'
                },
                {
                    id: 'productivity_impact',
                    name: 'Productivity Impact',
                    description: 'Measured impact on developer productivity',
                    metricType: 'Percentage Improvement',
                    evaluationCriteria: 'Measures productivity gains and efficiency improvements'
                }
            ]
        },
        {
            id: 'llm_backend',
            name: 'LLM Backend & Model Ecosystem Integration',
            description: 'Integration with LLM backends and model ecosystems',
            kpis: [
                {
                    id: 'model_performance',
                    name: 'Model Performance',
                    description: 'Performance and accuracy of underlying language models',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Evaluates model accuracy, speed, and reliability'
                },
                {
                    id: 'model_selection',
                    name: 'Model Selection & Switching',
                    description: 'Ability to select and switch between different models',
                    metricType: 'Count of Models',
                    evaluationCriteria: 'Measures model variety and switching capabilities'
                },
                {
                    id: 'custom_model_support',
                    name: 'Custom Model Support',
                    description: 'Support for custom or fine-tuned models',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Assesses custom model integration capabilities'
                },
                {
                    id: 'response_latency',
                    name: 'Response Latency',
                    description: 'Speed of model responses and code generation',
                    metricType: 'Milliseconds',
                    evaluationCriteria: 'Measures response time and system performance'
                },
                {
                    id: 'offline_capabilities',
                    name: 'Offline Capabilities',
                    description: 'Ability to function without internet connectivity',
                    metricType: 'Binary (Yes/No)',
                    evaluationCriteria: 'Evaluates offline functionality and local processing'
                },
                {
                    id: 'api_ecosystem',
                    name: 'API Ecosystem Integration',
                    description: 'Integration with external APIs and services',
                    metricType: 'Count of Integrations',
                    evaluationCriteria: 'Measures API connectivity and ecosystem integration'
                },
                {
                    id: 'cost_efficiency',
                    name: 'Cost Efficiency',
                    description: 'Cost-effectiveness of model usage and operations',
                    metricType: 'Cost per Query',
                    evaluationCriteria: 'Evaluates operational costs and pricing models'
                },
                {
                    id: 'scalability',
                    name: 'Scalability',
                    description: 'Ability to scale with increased usage and team size',
                    metricType: 'Qualitative Scale (1-5)',
                    evaluationCriteria: 'Assesses scalability and performance under load'
                }
            ]
        }
    ],
    tools: [
        {
            id: 'vscode_copilot',
            name: 'VS Code + Copilot',
            description: 'Visual Studio Code with GitHub Copilot integration',
            color: '#007ACC'
        },
        {
            id: 'cursor',
            name: 'Cursor',
            description: 'AI-powered code editor',
            color: '#000000'
        },
        {
            id: 'windsurf',
            name: 'Windsurf',
            description: 'AI-enhanced development environment',
            color: '#FF6B6B'
        }
    ]
};

// Default empty scores structure
const defaultScores = {
    userScores: {},
    teamStats: {},
    lastUpdated: null
};

// Helper functions
function getKPIById(kpiId) {
    for (const category of kpiData.categories) {
        for (const kpi of category.kpis) {
            if (kpi.id === kpiId) {
                return { ...kpi, categoryId: category.id, categoryName: category.name };
            }
        }
    }
    return null;
}

function getCategoryById(categoryId) {
    return kpiData.categories.find(cat => cat.id === categoryId);
}

function getToolById(toolId) {
    return kpiData.tools.find(tool => tool.id === toolId);
}

function getAllKPIs() {
    const allKPIs = [];
    for (const category of kpiData.categories) {
        for (const kpi of category.kpis) {
            allKPIs.push({ ...kpi, categoryId: category.id, categoryName: category.name });
        }
    }
    return allKPIs;
}

function getKPIsByCategory(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return [];
    return category.kpis.map(kpi => ({ ...kpi, categoryId, categoryName: category.name }));
}

function getTotalKPICount() {
    return kpiData.categories.reduce((total, category) => total + category.kpis.length, 0);
}

function getCategoryStats() {
    return kpiData.categories.map(category => ({
        id: category.id,
        name: category.name,
        kpiCount: category.kpis.length,
        description: category.description
    }));
}

// Export data and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        kpiData,
        defaultScores,
        getKPIById,
        getCategoryById,
        getToolById,
        getAllKPIs,
        getKPIsByCategory,
        getTotalKPICount,
        getCategoryStats
    };
} 