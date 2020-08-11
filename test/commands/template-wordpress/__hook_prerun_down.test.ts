import {expect, test} from '@oclif/test'

describe('template-wordpress:__hook_prerun_down', () => {
  test
  .stdout()
  .command(['template-wordpress:__hook_prerun_down'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:__hook_prerun_down', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
