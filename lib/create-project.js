import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProject({ projectName, githubUsername, packageManager }) {
  const templateDir = path.join(__dirname, '../templates');
  const targetDir = path.join(process.cwd(), projectName);

  // Ensure target directory doesn't exist
  if (await fs.exists(targetDir)) {
    throw new Error(`Directory ${projectName} already exists`);
  }

  // Copy template files
  await fs.copy(templateDir, targetDir);

  // Read and update package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = projectName;
  packageJson.author = githubUsername;
  packageJson.repository.url = `git+https://github.com/${githubUsername}/${projectName}.git`;

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // Initialize git repository
  await execa('git', ['init'], { cwd: targetDir });
  await execa('git', ['add', '.'], { cwd: targetDir });
  await execa('git', ['commit', '-m', 'Initial commit'], { cwd: targetDir });

  // Install dependencies
  console.log(`\nInstalling dependencies using ${packageManager}...`);
  await execa(packageManager, ['install'], { cwd: targetDir, stdio: 'inherit' });
}
