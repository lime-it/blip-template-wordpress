import {expect, test} from '@oclif/test'

describe('template-wordpress:__hook_postrun_up', () => {
  test
  .stdout()
  .command(['template-wordpress:__hook_postrun_up'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:__hook_postrun_up', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
