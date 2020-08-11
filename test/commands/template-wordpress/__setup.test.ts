import {expect, test} from '@oclif/test'

describe('template-wordpress:__setup', () => {
  test
  .stdout()
  .command(['template-wordpress:__setup'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:__setup', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
