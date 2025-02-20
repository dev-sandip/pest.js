#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { createProject } from '../lib/create-project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('create-express-ts-api')
  .description('Generate a feature-based Node.js, TypeScript, Express, and Mongoose project')
  .version('1.1.0');

program.parse();

async function init() {
  console.log(chalk.blue('Welcome to Express TypeScript API Generator!\n'));

  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'nodejs-ts-express-mongoose-boilerplate'
    },
    {
      type: 'input',
      name: 'githubUsername',
      message: 'What is your GitHub username?',
      default: 'example-user'
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm'
    }
  ];

  const answers = await inquirer.prompt(questions);
  const spinner = ora('Creating project...').start();

  try {
    await createProject(answers);
    spinner.succeed(chalk.green('Project created successfully!'));

    console.log('\nTo get started:');
    console.log(chalk.cyan(`  cd ${answers.projectName}`));
    console.log(chalk.cyan(`  ${answers.packageManager} run dev`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}

init();
