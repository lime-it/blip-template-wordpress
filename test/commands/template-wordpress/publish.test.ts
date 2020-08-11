import {expect, test} from '@oclif/test'

describe('template-wordpress:publish', () => {
  test
  .stdout()
  .command(['template-wordpress:publish'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:publish', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
