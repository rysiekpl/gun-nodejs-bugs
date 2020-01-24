@test "put() without AXE" {
  node /opt/gun-nodejs-bugs/ put "$BATS_TEST_FILENAME" "$BATS_TEST_NAME" "$BATS_TEST_NAME" && \
  node /opt/gun-nodejs-bugs/ get "$BATS_TEST_FILENAME" "$BATS_TEST_NAME" | grep "$BATS_TEST_FILENAME.$BATS_TEST_NAME: $BATS_TEST_NAME"
}

@test "put() with AXE" {
  node /opt/gun-nodejs-bugs/ --axe put "$BATS_TEST_FILENAME" "$BATS_TEST_NAME" "$BATS_TEST_NAME" && \
  node /opt/gun-nodejs-bugs/ get "$BATS_TEST_FILENAME" "$BATS_TEST_NAME" | grep "$BATS_TEST_FILENAME.$BATS_TEST_NAME: $BATS_TEST_NAME"
}
