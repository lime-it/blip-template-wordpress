import {expect, test} from '@oclif/test'

describe('template-wordpress:__teardown', () => {
  test
  .stdout()
  .command(['template-wordpress:__teardown'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:__teardown', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
