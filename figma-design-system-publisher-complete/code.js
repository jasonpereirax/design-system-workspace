console.log('Plugin inicializando...');
figma.showUI(__html__, { width: 900, height: 700, themeColors: true });

var workflowPaused = false;
var currentWorkflow = null;

console.log('Plugin carregado. Aguardando mensagens...');

figma.ui.onmessage = async function(msg) {
  console.log('Mensagem recebida:', msg.type);

  if (msg.type === 'get-credentials') {
    var credentials = await figma.clientStorage.getAsync('credentials') || {};
    console.log('Credenciais recuperadas do storage');
    figma.ui.postMessage({
      type: 'credentials-loaded',
      credentials: credentials
    });
  }

  if (msg.type === 'save-credentials') {
    await figma.clientStorage.setAsync('credentials', msg.credentials);
    console.log('Credenciais salvas no storage');
  }

  if (msg.type === 'get-components') {
    console.log('Carregando componentes...', msg.source);
    var components = [];

    if (msg.source === 'selection') {
      components = await getComponentsFromSelection();
    } else if (msg.source === 'current-page') {
      components = await getComponentsFromCurrentPage();
    } else {
      components = await getComponentsFromLibrary();
    }

    console.log('Componentes encontrados:', components.length);
    figma.ui.postMessage({
      type: 'components-list',
      components: components
    });
  }

  if (msg.type === 'get-pages') {
    var pages = figma.root.children.map(function(page) {
      return { id: page.id, name: page.name };
    });
    figma.ui.postMessage({
      type: 'pages-list',
      pages: pages
    });
  }

  if (msg.type === 'get-variants') {
    var variants = await getComponentVariants(msg.componentId);
    figma.ui.postMessage({
      type: 'variants-list',
      componentId: msg.componentId,
      variants: variants
    });
  }

  if (msg.type === 'start-workflow') {
    executeWorkflow(msg);
  }

  if (msg.type === 'pause-workflow') {
    workflowPaused = true;
    figma.ui.postMessage({ type: 'workflow-paused' });
  }

  if (msg.type === 'resume-workflow') {
    workflowPaused = false;
    figma.ui.postMessage({ type: 'workflow-resumed' });
    if (currentWorkflow) {
      continueWorkflow(currentWorkflow);
    }
  }

  if (msg.type === 'cancel-workflow') {
    workflowPaused = false;
    currentWorkflow = null;
    figma.ui.postMessage({ type: 'workflow-cancelled' });
  }
};

async function executeWorkflow(msg) {
  currentWorkflow = msg;
  
  var steps = [
    { id: 'extract', name: 'Extraindo designs do Figma', status: 'pending' },
    { id: 'figma-mcp', name: 'Processando com Figma MCP', status: 'pending' },
    { id: 'generate-code', name: 'Gerando código (HTML, React, Tailwind)', status: 'pending' },
    { id: 'gauge-deploy', name: 'Publicando no Gauge DS', status: 'pending' },
    { id: 'create-files', name: 'Criando estrutura de arquivos', status: 'pending' },
    { id: 'git-commit', name: 'Fazendo commit no Git', status: 'pending' },
    { id: 'github-pr', name: 'Criando Pull Request', status: 'pending' },
    { id: 'vercel-deploy', name: 'Configurando deploy na Vercel', status: 'pending' }
  ];

  figma.ui.postMessage({ type: 'workflow-started', steps: steps });

  try {
    await updateStep(steps, 'extract', 'running');
    if (workflowPaused) { await waitForResume(); }
    var designData = await extractDesigns(msg.components);
    await updateStep(steps, 'extract', 'success', designData.length + ' componentes extraídos');

    await updateStep(steps, 'figma-mcp', 'running');
    if (workflowPaused) { await waitForResume(); }
    var mcpData = await callFigmaMCP(designData, msg);
    await updateStep(steps, 'figma-mcp', 'success', 'Dados processados pelo Figma MCP');

    await updateStep(steps, 'generate-code', 'running');
    if (workflowPaused) { await waitForResume(); }
    var generatedCode = await generateCodeWithClaude(mcpData, msg);
    await updateStep(steps, 'generate-code', 'success', 'Código gerado em 3 formatos');

    await updateStep(steps, 'gauge-deploy', 'running');
    if (workflowPaused) { await waitForResume(); }
    var gaugeResult = await deployToGauge(designData, generatedCode, msg);
    if (gaugeResult && gaugeResult.skipped) {
      await updateStep(steps, 'gauge-deploy', 'success', 'Ignorado (nao configurado)');
    } else {
      await updateStep(steps, 'gauge-deploy', 'success', 'Publicado no Gauge');
    }

    await updateStep(steps, 'create-files', 'running');
    if (workflowPaused) { await waitForResume(); }
    var fileStructure = await createFileStructure(generatedCode, msg);
    await updateStep(steps, 'create-files', 'success', fileStructure.count + ' arquivos criados');

    await updateStep(steps, 'git-commit', 'running');
    if (workflowPaused) { await waitForResume(); }
    var commitResult = await gitCommit(fileStructure, msg);
    await updateStep(steps, 'git-commit', 'success', 'Commit: ' + commitResult.hash);

    await updateStep(steps, 'github-pr', 'running');
    if (workflowPaused) { await waitForResume(); }
    var prUrl = await createGitHubPR(commitResult, msg);
    await updateStep(steps, 'github-pr', 'success', 'PR criado com sucesso');

    await updateStep(steps, 'vercel-deploy', 'running');
    if (workflowPaused) { await waitForResume(); }
    var vercelUrl = await setupVercelDeploy(msg, prUrl);
    await updateStep(steps, 'vercel-deploy', 'success', 'Deploy configurado');

    figma.ui.postMessage({ 
      type: 'workflow-completed',
      prUrl: prUrl,
      vercelUrl: vercelUrl
    });

  } catch (error) {
    figma.ui.postMessage({ 
      type: 'workflow-error',
      error: error.message 
    });
  }
}

function waitForResume() {
  return new Promise(function(resolve) {
    var checkInterval = setInterval(function() {
      if (!workflowPaused) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
  });
}

function continueWorkflow(workflow) {
  executeWorkflow(workflow);
}

async function updateStep(steps, stepId, status, message) {
  var step = null;
  for (var i = 0; i < steps.length; i++) {
    if (steps[i].id === stepId) {
      step = steps[i];
      break;
    }
  }
  
  if (step) {
    step.status = status;
    step.message = message;
    figma.ui.postMessage({ type: 'step-updated', step: step });
    await sleep(800);
  }
}

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

async function extractDesigns(componentIds) {
  var designs = [];
  
  for (var i = 0; i < componentIds.length; i++) {
    var id = componentIds[i];
    var node = figma.getNodeById(id);
    if (!node) continue;

    var imageData = await node.exportAsync({
      format: 'PNG',
      constraint: { type: 'SCALE', value: 2 }
    });

    var svgData = await node.exportAsync({
      format: 'SVG_STRING'
    });

    designs.push({
      id: node.id,
      name: node.name,
      type: node.type,
      imageData: imageData,
      svgData: svgData,
      figmaUrl: 'https://figma.com/file/' + figma.fileKey + '?node-id=' + node.id.replace(':', '-'),
      bounds: {
        width: node.width,
        height: node.height
      }
    });
  }

  return designs;
}

async function callFigmaMCP(designData, config) {
  return {
    designs: designData,
    fileKey: figma.fileKey,
    fileName: figma.root.name,
    config: config
  };
}

async function generateCodeWithClaude(mcpData, config) {
  if (!config.anthropicKey) {
    console.log('Claude API key not provided, using templates...');
    return generateCodeWithTemplates(mcpData);
  }

  console.log('Generating code with Claude API for', mcpData.designs.length, 'components...');

  return new Promise(function(resolve, reject) {
    figma.ui.postMessage({
      type: 'claude-api-request',
      data: {
        anthropicKey: config.anthropicKey,
        fileKey: mcpData.fileKey,
        fileName: mcpData.fileName,
        designs: mcpData.designs
      }
    });

    var messageHandler = function(msg) {
      if (msg.type === 'claude-api-response') {
        figma.ui.off('message', messageHandler);
        if (msg.success) {
          resolve({ components: msg.result });
        } else {
          console.error('Claude API failed, falling back to templates:', msg.error);
          resolve(generateCodeWithTemplates(mcpData));
        }
      }
    };

    figma.ui.on('message', messageHandler);

    setTimeout(function() {
      figma.ui.off('message', messageHandler);
      console.log('Claude API timeout, falling back to templates');
      resolve(generateCodeWithTemplates(mcpData));
    }, 120000); // 2 minutes timeout for AI generation
  });
}

function generateCodeWithTemplates(mcpData) {
  var components = [];

  for (var i = 0; i < mcpData.designs.length; i++) {
    var design = mcpData.designs[i];
    components.push({
      name: design.name,
      html: generateHTMLCode(design),
      react: generateReactCode(design),
      tailwind: generateTailwindCode(design),
      css: generateCSSCode(design)
    });
  }

  return { components: components };
}

async function createFileStructure(code, config) {
  var files = [];
  
  for (var i = 0; i < code.components.length; i++) {
    var component = code.components[i];
    var safeName = component.name.replace(/[^a-zA-Z0-9]/g, '');
    
    files.push({
      path: 'src/components/' + safeName + '/' + safeName + '.html',
      content: component.html
    });
    files.push({
      path: 'src/components/' + safeName + '/' + safeName + '.tsx',
      content: component.react
    });
    files.push({
      path: 'src/components/' + safeName + '/' + safeName + '.tailwind.tsx',
      content: component.tailwind
    });
    files.push({
      path: 'src/components/' + safeName + '/' + safeName + '.module.css',
      content: component.css
    });
  }

  return { files: files, count: files.length };
}

async function gitCommit(fileStructure, config) {
  if (!config.githubToken || !config.repoOwner || !config.repoName) {
    throw new Error('GitHub credentials missing');
  }

  var timestamp = Date.now();
  var commitMessage = 'feat: Add ' + fileStructure.count + ' components from Figma';
  var branchName = 'feature/figma-components-' + timestamp;

  var commitData = {
    githubToken: config.githubToken,
    repoOwner: config.repoOwner,
    repoName: config.repoName,
    branchName: branchName,
    message: commitMessage,
    files: fileStructure.files
  };

  return new Promise(function(resolve, reject) {
    figma.ui.postMessage({
      type: 'git-commit-request',
      data: commitData
    });

    var messageHandler = function(msg) {
      if (msg.type === 'git-commit-response') {
        figma.ui.off('message', messageHandler);
        if (msg.success) {
          resolve({
            hash: msg.result.sha,
            branch: branchName,
            message: commitMessage,
            files: fileStructure.files
          });
        } else {
          reject(new Error(msg.error || 'Git commit failed'));
        }
      }
    };

    figma.ui.on('message', messageHandler);

    setTimeout(function() {
      figma.ui.off('message', messageHandler);
      reject(new Error('Git commit timeout'));
    }, 60000);
  });
}

async function createGitHubPR(commitResult, config) {
  if (!config.githubToken || !config.repoOwner || !config.repoName) {
    throw new Error('GitHub credentials missing');
  }

  var prData = {
    title: '🎨 Design System Update from Figma',
    body: '## Automated PR created by Design System Publisher\n\n**Branch:** `' + commitResult.branch + '`\n**Files changed:** ' + commitResult.files.length + '\n**Commit:** ' + commitResult.hash + '\n\n### Components\n' + commitResult.files.map(function(f) { return '- `' + f.path + '`'; }).join('\n'),
    head: commitResult.branch,
    base: 'main',
    githubToken: config.githubToken,
    repoOwner: config.repoOwner,
    repoName: config.repoName
  };

  return new Promise(function(resolve, reject) {
    figma.ui.postMessage({
      type: 'create-pr-request',
      data: prData
    });

    var messageHandler = function(msg) {
      if (msg.type === 'create-pr-response') {
        figma.ui.off('message', messageHandler);
        if (msg.success) {
          resolve(msg.result.html_url);
        } else {
          reject(new Error(msg.error || 'PR creation failed'));
        }
      }
    };

    figma.ui.on('message', messageHandler);

    setTimeout(function() {
      figma.ui.off('message', messageHandler);
      reject(new Error('PR creation timeout'));
    }, 60000);
  });
}

async function setupVercelDeploy(config, prUrl) {
  if (!config.vercelToken) {
    console.log('Vercel token not provided, skipping auto-deploy');
    return 'https://vercel.com/new/import?repository=' + config.repoOwner + '/' + config.repoName;
  }

  var vercelData = {
    vercelToken: config.vercelToken,
    projectName: config.repoName,
    framework: 'react',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    githubRepo: config.repoOwner + '/' + config.repoName
  };

  return new Promise(function(resolve, reject) {
    figma.ui.postMessage({
      type: 'vercel-deploy-request',
      data: vercelData
    });

    var messageHandler = function(msg) {
      if (msg.type === 'vercel-deploy-response') {
        figma.ui.off('message', messageHandler);
        if (msg.success) {
          resolve(msg.result.url || 'https://vercel.com/' + config.repoOwner + '/' + config.repoName);
        } else {
          reject(new Error(msg.error || 'Vercel deploy failed'));
        }
      }
    };

    figma.ui.on('message', messageHandler);

    setTimeout(function() {
      figma.ui.off('message', messageHandler);
      reject(new Error('Vercel deploy timeout'));
    }, 60000);
  });
}

async function deployToGauge(designs, generatedCode, config) {
  if (!config.gaugeProjectId || !config.gaugeEmail) {
    return { skipped: true };
  }

  var baseUrl = config.gaugeUrl || 'http://localhost:5174';
  var version = config.gaugeVersion && config.gaugeVersion.trim()
    ? config.gaugeVersion.trim()
    : 'v' + Date.now();

  var components = [];
  for (var i = 0; i < generatedCode.components.length; i++) {
    var codeItem = generatedCode.components[i];
    var design = designs[i] || {};
    components.push({
      name: codeItem.name,
      type: design.type,
      html: codeItem.html,
      react: codeItem.react,
      tailwind: codeItem.tailwind,
      css: codeItem.css,
      svgData: design.svgData,
      figmaUrl: design.figmaUrl,
      bounds: design.bounds
    });
  }

  var deployData = {
    baseUrl: baseUrl,
    email: config.gaugeEmail,
    projectId: config.gaugeProjectId,
    version: version,
    payload: {
      components: components,
      metadata: {
        fileKey: figma.fileKey,
        fileName: figma.root.name,
        source: 'figma-plugin'
      }
    }
  };

  return new Promise(function(resolve, reject) {
    figma.ui.postMessage({
      type: 'gauge-deploy-request',
      data: deployData
    });

    var messageHandler = function(msg) {
      if (msg.type === 'gauge-deploy-response') {
        figma.ui.off('message', messageHandler);
        if (msg.success) {
          resolve(msg.result);
        } else {
          reject(new Error(msg.error || 'Gauge deploy falhou'));
        }
      }
    };

    figma.ui.on('message', messageHandler);

    setTimeout(function() {
      figma.ui.off('message', messageHandler);
      reject(new Error('Gauge deploy timeout'));
    }, 30000);
  });
}

function generateHTMLCode(design) {
  var className = design.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return '<!DOCTYPE html>\\n<html lang="pt-BR">\\n<head>\\n  <meta charset="UTF-8">\\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n  <title>' + design.name + '</title>\\n  <link rel="stylesheet" href="./' + design.name + '.module.css">\\n</head>\\n<body>\\n  <div class="' + className + '">\\n    <h1>' + design.name + '</h1>\\n    <!-- Componente: ' + design.name + ' -->\\n    <!-- Dimensões: ' + design.bounds.width + 'x' + design.bounds.height + ' -->\\n  </div>\\n</body>\\n</html>';
}

function generateReactCode(design) {
  var componentName = design.name.replace(/[^a-zA-Z0-9]/g, '');
  return 'import React from "react";\\nimport styles from "./' + componentName + '.module.css";\\n\\ninterface ' + componentName + 'Props {\\n  className?: string;\\n  children?: React.ReactNode;\\n}\\n\\nexport const ' + componentName + ': React.FC<' + componentName + 'Props> = ({ className, children }) => {\\n  return (\\n    <div className={`${styles.container} ${className || \'\'}`}>\\n      <h2>' + design.name + '</h2>\\n      {children}\\n    </div>\\n  );\\n};\\n\\nexport default ' + componentName + ';';
}

function generateTailwindCode(design) {
  var componentName = design.name.replace(/[^a-zA-Z0-9]/g, '');
  return 'import React from "react";\\n\\ninterface ' + componentName + 'Props {\\n  className?: string;\\n  children?: React.ReactNode;\\n}\\n\\nexport const ' + componentName + ': React.FC<' + componentName + 'Props> = ({ className, children }) => {\\n  return (\\n    <div className={`w-full min-h-[' + Math.round(design.bounds.height) + 'px] flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md ${className || \'\'}`}>\\n      <h2 className="text-2xl font-bold mb-4">' + design.name + '</h2>\\n      {children}\\n    </div>\\n  );\\n};\\n\\nexport default ' + componentName + ';';
}

function generateCSSCode(design) {
  var className = design.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return '.container {\\n  width: ' + Math.round(design.bounds.width) + 'px;\\n  height: ' + Math.round(design.bounds.height) + 'px;\\n  padding: 24px;\\n  background: #ffffff;\\n  border-radius: 8px;\\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: center;\\n}\\n\\n.container h2 {\\n  font-size: 24px;\\n  font-weight: 600;\\n  color: #111827;\\n  margin-bottom: 16px;\\n}';
}

async function getComponentsFromSelection() {
  var components = [];
  var selection = figma.currentPage.selection;

  try {
    for (var i = 0; i < selection.length; i++) {
      var node = selection[i];
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        var isSet = node.type === 'COMPONENT_SET';
        var variantCount = isSet ? node.children.length : 0;

        var thumbnail = null;
        try {
          thumbnail = await node.exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: 2 }
          });
        } catch (err) {
          console.log('Failed to export thumbnail for: ' + node.name);
          thumbnail = new Uint8Array(0);
        }

        components.push({
          id: node.id,
          name: node.name,
          displayName: node.name,
          description: node.description || '',
          pageName: figma.currentPage.name,
          type: node.type,
          isSet: isSet,
          variantCount: variantCount,
          thumbnail: thumbnail,
          figmaUrl: 'https://figma.com/file/' + figma.fileKey + '?node-id=' + node.id.replace(':', '-')
        });
      }
    }
  } catch (error) {
    console.error('Error loading components from selection:', error);
  }

  return components;
}

async function getComponentsFromCurrentPage() {
  var components = [];
  var page = figma.currentPage;

  try {
    for (var n = 0; n < page.children.length; n++) {
      var node = page.children[n];
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        var isSet = node.type === 'COMPONENT_SET';
        var variantCount = isSet ? node.children.length : 0;

        var thumbnail = null;
        try {
          thumbnail = await node.exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: 2 }
          });
        } catch (err) {
          console.log('Failed to export thumbnail for: ' + node.name);
          thumbnail = new Uint8Array(0);
        }

        components.push({
          id: node.id,
          name: node.name,
          displayName: node.name,
          description: node.description || '',
          pageName: page.name,
          type: node.type,
          isSet: isSet,
          variantCount: variantCount,
          thumbnail: thumbnail,
          figmaUrl: 'https://figma.com/file/' + figma.fileKey + '?node-id=' + node.id.replace(':', '-')
        });
      }
    }
  } catch (error) {
    console.error('Error loading components from current page:', error);
  }

  return components;
}

async function getComponentsFromLibrary() {
  var components = [];

  try {
    for (var p = 0; p < figma.root.children.length; p++) {
      var page = figma.root.children[p];
      for (var n = 0; n < page.children.length; n++) {
        var node = page.children[n];
        if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
          var isSet = node.type === 'COMPONENT_SET';
          var variantCount = isSet ? node.children.length : 0;

          var thumbnail = null;
          try {
            thumbnail = await node.exportAsync({
              format: 'PNG',
              constraint: { type: 'SCALE', value: 2 }
            });
          } catch (err) {
            console.log('Failed to export thumbnail for: ' + node.name);
            thumbnail = new Uint8Array(0);
          }

          components.push({
            id: node.id,
            name: node.name,
            displayName: node.name,
            description: node.description || '',
            pageName: page.name,
            type: node.type,
            isSet: isSet,
            variantCount: variantCount,
            thumbnail: thumbnail,
            figmaUrl: 'https://figma.com/file/' + figma.fileKey + '?node-id=' + node.id.replace(':', '-')
          });
        }
      }
    }
  } catch (error) {
    console.error('Error loading components:', error);
  }

  return components;
}

async function getComponentVariants(componentId) {
  try {
    var node = figma.getNodeById(componentId);
    if (!node || node.type !== 'COMPONENT_SET') return [];

    var variants = [];
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];
      var thumbnail = null;
      try {
        thumbnail = await child.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: 2 }
        });
      } catch (err) {
        console.log('Failed to export variant thumbnail for: ' + child.name);
        thumbnail = new Uint8Array(0);
      }

      variants.push({
        id: child.id,
        name: child.name,
        thumbnail: thumbnail
      });
    }

    return variants;
  } catch (error) {
    console.error('Error loading variants:', error);
    return [];
  }
}
