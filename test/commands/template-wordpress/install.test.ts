import {expect, test} from '@oclif/test'

describe('template-wordpress:install', () => {
  test
  .stdout()
  .command(['template-wordpress:install'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:install', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
