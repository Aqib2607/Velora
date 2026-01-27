# Maintenance Guide

## Daily
- Monitor Sentry for new errors.
- Verify scheduled backups are running (see `config/backup.php`).

## Weekly
- Review application logs `storage/logs/laravel.log`.
- Run database health check.
- **Security**: Run `npm audit` and `composer audit`.

## Monthly
- **Updates**: Run `composer update` and `npm update` to patch dependencies.
- **Performance**: Review database query performance and indexes.
- **Cleanup**: Clear old logs and temporary files.

## Quarterly
- **Passwords**: Rotate critical API keys and secrets if compliant with policy.
- **Load Testing**: Run `artillery run load-test.yml` to verify capacity.
- **Review**: Check for deprecated packages or code usage.

## Emergency Contacts
- **DevOps**: [Contact Info]
- **Lead Developer**: [Contact Info]
