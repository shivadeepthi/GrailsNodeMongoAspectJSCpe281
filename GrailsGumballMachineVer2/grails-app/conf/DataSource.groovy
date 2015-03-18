dataSource {
    pooled = true
    jmxExport = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
//    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
    singleSession = true // configure OSIV singleSession mode
    flush.mode = 'manual' // OSIV session flush mode outside of transactional context
}

// environment specific settings
environments {
	
	development {
		dataSource {
			dbCreate = "create-drop" // one of 'create', 'create-drop', 'update', 'validate', ''
//			url = "jdbc:h2:mem:devDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
			url = "jdbc:mysql://localhost:3306/cmpe281"
			driverClassName = "com.mysql.jdbc.Driver"
			username = "root"
			password = "root"
		}
	}
	test {
		dataSource {
			dbCreate = "update"  // 'create', 'create-drop','update'
			url = "jdbc:mysql://localhost:3306/cmpe281"
			driverClassName = "com.mysql.jdbc.Driver"
			username = "root"
			password = "root"
		}
	}
	production {
		dataSource {
			dbCreate = "update"  // 'create', 'create-drop','update'
			url = "jdbc:mysql://bb7312e2b75816:384c8422@us-cdbr-iron-east-01.cleardb.net:3306/ad_4f64a6d271fca1a"
			driverClassName = "com.mysql.jdbc.Driver"
			username = "bb7312e2b75816"
			password = "384c8422"
		}

	}
		
}
