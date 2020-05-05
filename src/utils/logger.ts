import chalk from 'chalk'

export function info(tag: string, ...data: any[]) {
  console.log(chalk.gray.underline(tag), ...data)
}

export function warn(tag: string, ...data: any[]) {
  console.log(chalk.yellow.underline(tag), ...data)
}

export function error(tag: string, ...data: any[]) {
  console.log(chalk.red.underline(tag), ...data)
}

export function success(tag: string, ...data: any[]) {
  console.log(chalk.green.underline(tag), ...data)
}

export default { info, warn, error, success }
