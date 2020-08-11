import {expect, test} from '@oclif/test'

describe('template-wordpress:pack', () => {
  test
  .stdout()
  .command(['template-wordpress:pack'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:pack', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
