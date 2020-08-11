import {expect, test} from '@oclif/test'

describe('template-wordpress:load', () => {
  test
  .stdout()
  .command(['template-wordpress:load'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:load', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
